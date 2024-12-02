function drawScene(gl, programInfo, buffers, cubeRotation) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Define a cor de fundo para preto, totalmente opaco
  gl.clearDepth(1.0); // Limpa a profundidade
  gl.enable(gl.DEPTH_TEST); // Habilita o teste de profundidade
  gl.depthFunc(gl.LEQUAL); // Obscurece objetos próximos

  // Limpa a tela antes de desenhar
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Campo de visão da câmera (perspectiva)
  const fieldOfView = (45 * Math.PI) / 180; // Em radianos

  // Razão de aspecto, R = Largura / Altura
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  // Unidade de elementos visiveis
  const zNear = 0.1;

  // Distância da câmera até o objeto
  const zFar = 100.0;

  // Cria a matriz de projeção
  const projectionMatrix = mat4.create();

  // Executa operações de matriz e atribui o resultado para o 'projectionMatrix'
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Define o ponto de desenho como "identidade", ou seja, ao centro da cena
  const modelViewMatrix = mat4.create();

  // Executa uma transformação de translação a nossa cena
  // de 6 unidades de distância em Z
  mat4.translate(
    modelViewMatrix, // Matriz de destino
    modelViewMatrix, // Matriz de origem
    [-0.0, 0.0, -8.0] // Unidades de translação (x, y, z)
  );

  // Executa uma transformação de rotação a nossa cena
  // recebendo um parâmetro que é o grau de rotação 
  mat4.rotate(
    modelViewMatrix, // Matriz de destino
    modelViewMatrix, // Matriz que será rotacionada
    cubeRotation * 0.7, // Angulo de rotação em radianos
    [0, 0, 1] // Rotaciona em 1 unidade o eixo z
  );
  
  mat4.rotate(
    modelViewMatrix, // Matriz de destino
    modelViewMatrix, // Matriz que será rotacionada
    cubeRotation * 0.7, // Angulo de rotação em radianos
    [0, 1, 0] // Rotaciona em 1 unidade o eixo Y
  );

  mat4.rotate(
    modelViewMatrix, // Matriz de destino
    modelViewMatrix, // Matriz que será rotacionada
    cubeRotation * 0.3, // Angulo de rotação em radianos
    [1, 0, 0] // Rotaciona em 1 unidade o eixo x
  );

  mat4.scale(
    modelViewMatrix, // Matriz de destino
    modelViewMatrix, // Matriz de origem
    [1, 1, 1]
  );
  // Informa como extrair as posições do buffer para vertexPosition
  // e que cores aplicar para cada vértice do buffer de cores para vertexColor
  setPositionAttribute(gl, buffers, programInfo);
  setColorAttribute(gl, buffers, programInfo);

  // Informa ao WebGL quais indeces ele deve seguir para definir as faces
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

  // Informa qual programa o WebGL deve usar para desenhar
  gl.useProgram(programInfo.program);

  // Atribui shaders criados
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  const vertexCount = 36;
  const type = gl.UNSIGNED_SHORT;
  const offset = 0;
  gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}

function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3; // Valores por interação
  const type = gl.FLOAT; // Os valores são float de 32bits
  const normalize = false; // não normalizar
  const stride = 0; // Número de bytes para obter de um conjunto de valores, Sempre "0"
  const offset = 0; // Quantos bytes dentro do buffer para iniciar

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

export { drawScene };
