export const useRotateTowardsDirection = (ref) => {
  const prevPosition = new Vector3(0, 0, 0);
  const direction = new Vector3();
  const targetQuaternion = new Quaternion();
  const upVector = new Vector3(0, 1, 0);

  useFrame(() => {
    if (!ref.current) return;
    const curr = ref.current.position;
    const prev = prevPosition;

    // Calculate direction vector
    direction.subVectors(curr, prev).normalize();

    // Only rotate if we're actually moving
    if (direction.lengthSq() > 0.001) {
      // Create rotation to face movement direction, keeping Y-axis up
      targetQuaternion.setFromRotationMatrix(
        new Matrix4().lookAt(new Vector3(0, 0, 0), direction, upVector)
      );

      // Smoothly interpolate current rotation to target rotation
      ref.current.quaternion.slerp(targetQuaternion, 0.1);
    }

    prev.copy(curr);
  });
};
