const request = require('supertest');
const app = require('./server');

describe('Prueba GET', () => {

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'A4@gmail.com', password: '1234' });

  token = res.body.token;
  console.log('Token obtenido:', token);
});


  test('GET /recetas debe retornar recetas', async () => {
    const response = await request(app)
      .get('/recetas')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body.length).toBeGreaterThanOrEqual(0);

    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('nombre');
      expect(response.body[0]).toHaveProperty('ingredientes');
      expect(response.body[0]).toHaveProperty('tiempo');
    }

   
  });

});

describe('Prueba POST', () => {
    let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'A4@gmail.com', password: '1234' });

  token = res.body.token;
  console.log('Token obtenido:', token);
});

test('POST /recetas debe de agregar recetas', async () => {
    const nuevaReceta = {
    nombre: 'papas',
    ingredientes: ['papa', 'agua'],
    tiempo: 20
  };

        const response = await request(app)
        .post('/recetas')
        .set('Authorization', `Bearer ${token}`)
        .send(nuevaReceta)
        .expect('Content-Type', /json/)
        .expect(201);

        expect(response.body).toHaveProperty('_id');

        
    });
});

describe('Prueba DELETE', () => {
  let token;
  let recetaId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'A4@gmail.com', password: '1234' });

    token = res.body.token;

    const nuevaReceta = { nombre: 'papas', ingredientes: ['patatas'], tiempo: 10 };
    const recetaRes = await request(app)
      .post('/recetas')
      .set('Authorization', `Bearer ${token}`)
      .send(nuevaReceta);

    recetaId = recetaRes.body._id; // guardar el id
  });

  test('DELETE /recetas/:id debe eliminar receta', async () => {
    const response = await request(app)
      .delete(`/recetas/${recetaId}`) // usar el id real
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.mensaje).toBe("Se ha eliminado esta receta.")
  });
});

describe('Prueba PUT', () => {
  let token;
  let recetaId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'A4@gmail.com', password: '1234' });

    token = res.body.token;

    const nuevaReceta = { nombre: 'papas', ingredientes: ['patatas'], tiempo: 10 };
    const recetaRes = await request(app)
      .post('/recetas')
      .set('Authorization', `Bearer ${token}`)
      .send(nuevaReceta);

    recetaId = recetaRes.body._id; 
  });

  test('PUT /recetas/:id debe actualizar receta', async () => {
    const cambios = { nombre: 'papas fritas', tiempo: 15 };

    const response = await request(app)
      .put(`/recetas/${recetaId}`) 
      .set('Authorization', `Bearer ${token}`)
      .send(cambios)
      .expect(200);

    expect(response.body).toHaveProperty('_id', recetaId);
    expect(response.body.nombre).toBe(cambios.nombre);
    expect(response.body.tiempo).toBe(cambios.tiempo);
  });
});