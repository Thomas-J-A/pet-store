module.exports = (str) => {
  const capitalizedString = `${ str.charAt(0).toUpperCase() }${ str.slice(1) }`;
  console.log(capitalizedString);
  return capitalizedString;
};
