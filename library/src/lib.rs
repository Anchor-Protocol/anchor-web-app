extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn plus(a: f64, b: f64) -> f64 {
    a + b
}

#[wasm_bindgen]
pub fn minus(a: f64, b: f64) -> f64 {
    a - b
}
