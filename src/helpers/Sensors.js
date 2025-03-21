export const getPermissions = function (names) {
  const promises = [];
  for (const name of names) {
    const promise = navigator.permissions.query({ name });
    promises.push(promise);
  }

  return Promise.all(promises).then((results) => {
    // console.log('getPermissions', results, results.every(result => result.state === "granted"))
    if (results.every((result) => result.state === 'granted')) {
      return true;
    } else {
      return false;
    }
  });
};

// export const getAccelerometer = async function () {
//   if (!window.Accelerometer) return null

//   let hasPermission = await getPermissions('accelerometer')
//   if (!hasPermission) return null

//   let accelerometer = new Accelerometer({ referenceFrame: 'device' });
//   try {
//       accelerometer =
//       accelerometer.addEventListener('error', event => {
//           // Handle runtime errors.
//           if (event.error.name === 'NotAllowedError') {
//               // Branch to code for requesting permission.
//           } else if (event.error.name === 'NotReadableError' ) {
//               console.log('Cannot connect to the sensor.');
//           }
//       });
//       accelerometer.addEventListener('reading', () => reloadOnShake(accelerometer));
//       accelerometer.start();
//   } catch (error) {
//       // Handle construction errors.
//       if (error.name === 'SecurityError') {
//           // See the note above about feature policy.
//           console.log('Sensor construction was blocked by a feature policy.');
//       } else if (error.name === 'ReferenceError') {
//           console.log('Sensor is not supported by the User Agent.');
//       } else {
//           throw error;
//       }
//   }
// }
