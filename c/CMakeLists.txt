cmake_minimum_required(VERSION 3.15)
project(nova402 VERSION 1.0.0 LANGUAGES C)

# Options
option(BUILD_SHARED_LIBS "Build shared library" ON)
option(BUILD_TESTING "Build tests" OFF)
option(BUILD_EXAMPLES "Build examples" OFF)
option(USE_OPENSSL "Use OpenSSL for crypto operations" OFF)

# C Standard
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Sources
set(SOURCES
    src/hashing.c
    src/signature.c
    src/validation.c
    src/merkle.c
    src/utils.c
    src/network.c
)

# Headers
set(HEADERS
    nova402.h
)

# Create library
add_library(nova402 ${SOURCES})

# Include directories
target_include_directories(nova402
    PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
        $<INSTALL_INTERFACE:include>
)

# Compiler flags
if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang")
    target_compile_options(nova402 PRIVATE
        -Wall
        -Wextra
        -Wpedantic
        -Werror
        -O3
        -march=native
    )
endif()

if(MSVC)
    target_compile_options(nova402 PRIVATE
        /W4
        /WX
        /O2
    )
endif()

# Link libraries
if(USE_OPENSSL)
    find_package(OpenSSL REQUIRED)
    target_link_libraries(nova402 PRIVATE OpenSSL::Crypto)
    target_compile_definitions(nova402 PRIVATE NOVA402_USE_OPENSSL)
endif()

# Installation
install(TARGETS nova402
    EXPORT nova402Targets
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
    RUNTIME DESTINATION bin
    INCLUDES DESTINATION include
)

install(FILES ${HEADERS}
    DESTINATION include/nova402
)

# CMake package config
install(EXPORT nova402Targets
    FILE Nova402Targets.cmake
    NAMESPACE Nova402::
    DESTINATION lib/cmake/Nova402
)

include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    "${CMAKE_CURRENT_BINARY_DIR}/Nova402ConfigVersion.cmake"
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY AnyNewerVersion
)

configure_file(cmake/Nova402Config.cmake.in
    "${CMAKE_CURRENT_BINARY_DIR}/Nova402Config.cmake"
    @ONLY
)

install(FILES
    "${CMAKE_CURRENT_BINARY_DIR}/Nova402Config.cmake"
    "${CMAKE_CURRENT_BINARY_DIR}/Nova402ConfigVersion.cmake"
    DESTINATION lib/cmake/Nova402
)

# Examples
if(BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()

# Testing
if(BUILD_TESTING)
    enable_testing()
    add_subdirectory(tests)
endif()

# Print build info
message(STATUS "Nova402 C Library v${PROJECT_VERSION}")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "Shared libs: ${BUILD_SHARED_LIBS}")
message(STATUS "OpenSSL: ${USE_OPENSSL}")

