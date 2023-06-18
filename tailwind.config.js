/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.js','./src/component/*.js'],
  theme: {
    extend: {
      colors:{
        'gray':'hsl(260, 3%, 22%)',
        'dark':'hsl(228, 7%, 15%)',
        'light-gray':'hsl(21, 21%, 87%)',
        'dark-gray':'hsl(225, 7%, 23%)',
        'cool-gray':'hsl(258, 7%, 26%)',
        'magnolia':'hsl(217, 100%, 97%)',
      },

    

    },
  },
  plugins: [],
}

