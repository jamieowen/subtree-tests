mat4 quaternionToMatrix4(vec4 q) {
    float qx = q.x;
    float qy = q.y;
    float qz = q.z;
    float qw = q.w;
    
    float qx2 = qx * qx;
    float qy2 = qy * qy;
    float qz2 = qz * qz;
    float qw2 = qw * qw;
    
    float qxqy = qx * qy;
    float qxqz = qx * qz;
    float qxqw = qx * qw;
    float qyqz = qy * qz;
    float qyqw = qy * qw;
    float qzqw = qz * qw;
    
    mat4 rotationMatrix;
    
    rotationMatrix[0][0] = qw2 + qx2 - qy2 - qz2;
    rotationMatrix[0][1] = 2.0 * (qxqy - qzqw);
    rotationMatrix[0][2] = 2.0 * (qxqz + qyqw);
    rotationMatrix[0][3] = 0.0;
    
    rotationMatrix[1][0] = 2.0 * (qxqy + qzqw);
    rotationMatrix[1][1] = qw2 - qx2 + qy2 - qz2;
    rotationMatrix[1][2] = 2.0 * (qyqz - qxqw);
    rotationMatrix[1][3] = 0.0;
    
    rotationMatrix[2][0] = 2.0 * (qxqz - qyqw);
    rotationMatrix[2][1] = 2.0 * (qyqz + qxqw);
    rotationMatrix[2][2] = qw2 - qx2 - qy2 + qz2;
    rotationMatrix[2][3] = 0.0;
    
    rotationMatrix[3][0] = 0.0;
    rotationMatrix[3][1] = 0.0;
    rotationMatrix[3][2] = 0.0;
    rotationMatrix[3][3] = 1.0;
    
    return rotationMatrix;
}