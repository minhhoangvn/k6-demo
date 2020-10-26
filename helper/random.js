module.exports.getRandomName = function () {
  var names = [
    'Ronnin',
    'Anna',
    'Rojin',
    'Massey',
    'Luisa',
    'Dawn',
    'Presley',
    'Sheppard',
    'Desdemona',
    'Maximillian',
    'Conroy',
    'Daryl',
    'Chenai',
    'Andersen',
    'John',
    'Carlos',
    'Mckinney',
    'Bruce',
  ];
  return names[Math.floor(Math.random() * names.length)];
};

module.exports.getRandomNumber = function (length) {
  var charset = '123456789';
  var result = '';
  for (var i = 0; i < length; i++) result += charset[Math.floor(Math.random() * charset.length)];
  return result;
};

module.exports.getRandomEmail = function () {
  return random.getRandomName() + random.getRandomNumber(24) + 'perf@kms.testing.coe.com';
};
