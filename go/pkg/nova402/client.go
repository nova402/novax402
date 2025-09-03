// Package nova402 provides Go SDK for Nova402 x402 payment protocol
package nova402

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Client represents an x402 protocol client
type Client struct {
	BaseURL        string
	Network        string
	PrivateKey     string
	FacilitatorURL string
	HTTPClient     *http.Client
}

// NewClient creates a new x402 client
func NewClient(network, facilitatorURL string) *Client {
	return &Client{
		Network:        network,
		FacilitatorURL: facilitatorURL,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// WithPrivateKey sets the private key for signing payments
func (c *Client) WithPrivateKey(privateKey string) *Client {
	c.PrivateKey = privateKey
	return c
}

// Get makes a GET request with automatic x402 payment handling
func (c *Client) Get(url string, headers map[string]string) (*http.Response, error) {
	return c.request("GET", url, nil, headers)
}

// Post makes a POST request with automatic x402 payment handling
func (c *Client) Post(url string, body interface{}, headers map[string]string) (*http.Response, error) {
	return c.request("POST", url, body, headers)
}

func (c *Client) request(method, url string, body interface{}, headers map[string]string) (*http.Response, error) {
	var bodyReader io.Reader
	
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal body: %w", err)
		}
		bodyReader = bytes.NewReader(jsonBody)
	}

	req, err := http.NewRequest(method, url, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	for k, v := range headers {
		req.Header.Set(k, v)
	}

	// Make initial request
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}

	// Handle 402 Payment Required
	if resp.StatusCode == 402 {
		resp.Body.Close()
		return c.handlePaymentRequired(method, url, body, headers)
	}

	return resp, nil
}

func (c *Client) handlePaymentRequired(method, url string, body interface{}, headers map[string]string) (*http.Response, error) {
	// Make request to get payment requirements
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 402 {
		return nil, fmt.Errorf("expected 402, got %d", resp.StatusCode)
	}

	// Parse payment requirements
	var payment402 Payment402Response
	if err := json.NewDecoder(resp.Body).Decode(&payment402); err != nil {
		return nil, fmt.Errorf("failed to parse 402 response: %w", err)
	}

	if len(payment402.Accepts) == 0 {
		return nil, fmt.Errorf("no payment requirements provided")
	}

	// Select first payment requirement
	requirements := payment402.Accepts[0]

	// Create payment header
	paymentHeader, err := c.createPaymentHeader(requirements)
	if err != nil {
		return nil, fmt.Errorf("failed to create payment: %w", err)
	}

	// Retry request with payment
	var bodyReader io.Reader
	if body != nil {
		jsonBody, _ := json.Marshal(body)
		bodyReader = bytes.NewReader(jsonBody)
	}

	req, err = http.NewRequest(method, url, bodyReader)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-PAYMENT", paymentHeader)
	for k, v := range headers {
		req.Header.Set(k, v)
	}

	return c.HTTPClient.Do(req)
}

func (c *Client) createPaymentHeader(requirements PaymentRequirements) (string, error) {
	// TODO: Implement actual payment signing
	// For now, return a placeholder
	
	payment := PaymentHeader{
		X402Version: 1,
		Scheme:      requirements.Scheme,
		Network:     requirements.Network,
		Payload: PaymentPayload{
			Authorization: nil,
		},
	}

	jsonData, err := json.Marshal(payment)
	if err != nil {
		return "", err
	}

	// Base64 encode
	encoded := base64Encode(jsonData)
	return encoded, nil
}

func base64Encode(data []byte) string {
	return base64.StdEncoding.EncodeToString(data)
}

