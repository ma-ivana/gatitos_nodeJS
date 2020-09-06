const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
  Estado: "¡Bienvenido a mi API!"
  })
});


app.get('/gatitos', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`, (err, data) => {
    const dataJSON = JSON.parse(data);
    res.json({
      status: 'success',
      data: dataJSON,
    });
  });
});

// ----------------------------------------------------------------------------------------------
//                        GET GATITOS BY ID
// ----------------------------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------------------------
//                        GET GATITOS BY REFUGIO ID
// ----------------------------------------------------------------------------------------------

app.get(`/gatitos/:id/refugio/:refugioId`, (req, res) => {
  console.log(req.params)
  res.send("Me pediste un gatito en particular")
});


// ----------------------------------------------------------------------------------------------
//                        POST GATITOS - PARA CREAR NUEVOS GATITOS
// ----------------------------------------------------------------------------------------------

app.post('/gatitos', (req, res) => {

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
          message: `Ahora la lista tiene ${dataJSON.length} gatitos.`,
          data: {
            nuevoGato,
            createdAt: new Date()
          },
        });
      },
    );
  });
});

// ----------------------------------------------------------------------------------------------
//                        PUT GATITOS BY ID - PARA MODIFICAR GATITOS EXISTENTES
// ----------------------------------------------------------------------------------------------

app.put('/gatitos/:id', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`,
  (err, data) => {
    const dataJSON = JSON.parse(data);
    id = Number(req.params.id);
    const gatoModificado = dataJSON.filter(gato => gato.id === id);
    gatoModificado[0].longDesc = `Ahora también forma parte de los gatitos más lindos de esta lista`;
        

    fs.writeFile(
      `${__dirname}/assets/cats.json`,
      JSON.stringify(dataJSON),
      err => {        
        
        res.status(202).json({
          status: 'success',
          message: "Estos son los datos con la modificación:",
          data: {
            gatoModificado,
            modifiedAt: new Date()
          },
        });
      },
    );   
  });
});

// ----------------------------------------------------------------------------------------------
//                        DELETE GATITOS BY ID - PARA BORRAR GATITOS EXISTENTES
// ----------------------------------------------------------------------------------------------

app.delete('/gatitos/:id', (req, res) => {
  fs.readFile(`${__dirname}/assets/cats.json`,
  (err, data) => {
    const dataJSON = JSON.parse(data);
    id_delete = Number(req.params.id);
    const nuevoArrayDeGatos = dataJSON.filter(gato => gato.id !== id_delete);
    
    fs.writeFile(
      `${__dirname}/assets/cats.json`,
      JSON.stringify(nuevoArrayDeGatos),
      err => {          
        res.status(202).json({
          status: 'success',
          message: `Se borró el gatito con ID ${id_delete}. 
          Ahora la lista tiene un total de ${nuevoArrayDeGatos.length} gatitos.`, 
        });
      },
    );   
  });
});

const port = 8080;

app.listen(port, () => {
  console.log(`App corriendo en puerto ${port}`)
})