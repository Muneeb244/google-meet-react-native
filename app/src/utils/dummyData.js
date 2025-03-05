const getRandomImage = gender => {
  const num = Math.floor(Math.random() * 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
};

export const user = {
  name: 'Ritik',
  speaking: true,
  micOn: false,
  videoOn: true,
  photo: getRandomImage('men'),
};

export const peopleData = [
  {
    name: 'Hammad',
    speaking: true,
    micOn: false,
    videoOn: true,
    photo: getRandomImage('men'),
  },
  {name: 'Bob', micOn: false, videoOn: false, photo: getRandomImage('men')},
  {
    name: 'Ahmad',
    micOn: true,
    videoOn: true,

    photo: getRandomImage('men'),
  },
  {name: 'David', micOn: false, videoOn: true, photo: getRandomImage('men')},
  {
    name: 'Haziq',
    micOn: false,
    videoOn: false,
    photo: getRandomImage('men'),
  },
  {name: 'Frank', micOn: true, videoOn: true, photo: getRandomImage('men')},
  {
    name: 'Bilal',
    micOn: false,
    videoOn: true,
    photo: getRandomImage('men'),
  },
  {name: 'Basit', micOn: true, videoOn: false, photo: getRandomImage('men')},
  {name: 'Umer', micOn: false, videoOn: true, photo: getRandomImage('men')},
];
