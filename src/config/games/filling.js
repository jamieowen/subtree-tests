export const duration = 30;
export const cappingFps = 48;
export const threshold = 0.83;

export const initialSpeed = 0.7;
export const speedIncrease = 0.2;
export const maxSpeed = initialSpeed + speedIncrease * 7;

export const fillTimeMin = 0.5;
export const initialTimeToFill = 2;
export const fillTimeDecrease = (initialTimeToFill - fillTimeMin) / 7;
