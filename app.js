const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
  Estado: "Bienvenido a mi API!"
  })
});

// app.post('/', (req, res) => {
//   res.status(404).send('me hiciste un post!')
// })

app.get('/gatitos', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
    const dataJSON = JSON.parse(data);
    res.json({
      status: 'success',
      data: dataJSON,
    });
  });
});

app.get('/gatitos/:id', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {

    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error'        
      });
    }

      const gatos = JSON.parse(data);
      const id = Number(req.params.id);
      const gatosFiltrados = gatos.filter(gato => gato.id === id);

      if (!gatosFiltrados.length) {
        return res.status(404).json({
          status: 'fail',
          message: 'Gato no encontrado'
        });
      }

      res.send({
        status: "success",
        data: gatosFiltrados
      });
    });
  });

//     const dataJSON = JSON.parse(data)
//     res.json({
//       status: "success",
//       message: "Gatos encontrados",
//       gatitos: `${dataJSON.length} gatitos encontrados`
      
//     }) //acá va el nombre de la variable con el que guardé toda la info (const gatitos)
//   })  
// });
 //:id para cualquier ruta que el usuario escriba en la URL

app.get(`/gatitos/:id/refugio/:refugioId`, (req, res) => {
  console.log(req.params)
  res.send("me pediste un gatito en particular")
});

// app.get(`/gatitos/:id`, (req, res) => {
//   fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
//     const gatos = JSON.parse(data)
//     let id = Number(req.params.id)
//     const gatosFiltrados = gatos.filter(gato => gato.id === id)
//     console.log(gatosFiltrados)

//     if  (!gatosFiltrados.length) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Gato no encontrado"
//       })
//     }
//     res.json({
//       status: "success",
//       data: gatosFiltrados
//     })
//   })
// })

app.post('/gatitos', (req, res) => {
  // console.log(req.body)
  // res.send('Enviado')

  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => 
   {
    const dataJSON = JSON.parse(data);
    const nuevoGato = req.body;    
    nuevoGato.id = dataJSON.length;
    nuevoGato.name = "Gatito Lindo";
    nuevoGato.shortDesc = "Es un gatito recién agregado a la lista";
    nuevoGato.sexo = "m";
    dataJSON.push(nuevoGato);
  

    fs.writeFile(
      `${__dirname}/assets/cats.json`,
      JSON.stringify(dataJSON),
      err => {
        res.status(201).json({
          status: 'success',
          data: {
            nuevoGato,
            createdAt: new Date()
          },
        });
      },
    );
  });
});

const port = 8080;

app.listen(port, () => {
  console.log(`App corriendo en puerto ${port}`)
})