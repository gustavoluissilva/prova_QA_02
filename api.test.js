const pactum = require('pactum');

describe('Testes de API REST com api.restful-api.dev', () => {
  // Variável para guardar o ID do objeto criado no POST e usá-lo nos testes seguintes
  let objetoId = '';

  beforeAll(() => {
    // Configura a URL base da API pública
    pactum.request.setBaseUrl('https://api.restful-api.dev');
  });

  it('1. POST - Deve criar um novo dispositivo com sucesso', async () => {
    const resposta = await pactum.spec()
      .post('/objects')
      .withJson({
        name: 'Apple MacBook Pro 16 - Teste',
        data: {
          year: 2026,
          price: 1849.99,
          'CPU model': 'M3 Max',
          'Hard disk size': '1 TB'
        }
      })
      .expectStatus(200)
      .expectJsonLike({
        name: 'Apple MacBook Pro 16 - Teste'
      });

    // Salvamos o ID gerado pelo banco de dados deles para usar nos próximos métodos
    objetoId = resposta.json.id;
  });

  it('2. GET - Deve consultar o dispositivo recém-criado', async () => {
    await pactum.spec()
      .get(`/objects/${objetoId}`)
      .expectStatus(200)
      .expectJsonLike({
        id: objetoId,
        name: 'Apple MacBook Pro 16 - Teste'
      });
  });

  it('3. PUT - Deve atualizar completamente os dados do dispositivo', async () => {
    await pactum.spec()
      .put(`/objects/${objetoId}`)
      .withJson({
        name: 'Apple MacBook Pro 16 - Atualizado',
        data: {
          year: 2026,
          price: 2000.00, // Preço atualizado
          'CPU model': 'M3 Max',
          'Hard disk size': '2 TB' // Disco atualizado
        }
      })
      .expectStatus(200)
      .expectJsonLike({
        name: 'Apple MacBook Pro 16 - Atualizado'
      });
  });

  it('4. DELETE - Deve apagar o dispositivo', async () => {
    await pactum.spec()
      .delete(`/objects/${objetoId}`)
      .expectStatus(200)
      .expectJsonLike({
        message: `Object with id = ${objetoId} has been deleted.`
      });
  });

  it('5. GET - Deve retornar erro 404 ao buscar o dispositivo deletado', async () => {
    await pactum.spec()
      .get(`/objects/${objetoId}`)
      .expectStatus(404) // Valida que o objeto realmente não existe mais
      .expectJsonLike({
        error: `Oject with id=${objetoId} was not found.`
      });
  });
});