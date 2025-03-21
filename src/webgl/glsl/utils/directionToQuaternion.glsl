// Function to calculate Euler rotation angles from a direction vector
// The direction vector should be normalized
vec4 directionToQuaternion(vec3 direction) {
    // Define the axes for the cross product
    vec3 upAxis = vec3(0.0, 0.0, 1.0); // Positive z-axis
    vec3 crossAxis = cross(upAxis, direction);
    
    // Calculate the angle between the vectors
    float dotProduct = dot(upAxis, direction);
    float angle = acos(dotProduct);
    
    // Calculate the rotation axis
    vec3 rotationAxis = normalize(crossAxis);
    
    // Construct the quaternion
    float halfAngle = angle * 0.5;
    float sinHalfAngle = sin(halfAngle);
    float cosHalfAngle = cos(halfAngle);
    float qx = rotationAxis.x * sinHalfAngle;
    float qy = rotationAxis.y * sinHalfAngle;
    float qz = rotationAxis.z * sinHalfAngle;
    float qw = cosHalfAngle;

    vec4 q = vec4(qx, qy, qz, qw);
  
    return q;
}