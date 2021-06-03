export default function getFormData(formElems) {
  return Object.keys(formElems).reduce(
    (data, inputName) =>
      Number.isNaN(Number(inputName))
        ? {
            ...data,
            [inputName]: formElems[inputName].value,
          }
        : data,

    {},
  );
}
