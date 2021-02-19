pragma solidity 0.8.0;

struct targetProfile {
    uint8 age;
    uint8 gender;       // 0 - None, 1 - Female, 2 - Male               
    uint8 income;       // 0 - None, 1 - Low, 2 - Average, 3 - High
    uint8 education;    // 0 - None, 1 - Secondary, 2 - Poly, Bachelor's, 3 - Master's, PhD, Doctorate 
    uint8 residence;    // 0 - None, 1 - OCR, 2 - RCR, 3 - CCR
}

