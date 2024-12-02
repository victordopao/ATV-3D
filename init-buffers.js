// Inicia a criação do buffer para armazenar os vértices
function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);
  const colorBuffer = initColorBuffer(gl);
  const indexBuffer = initIndexBuffer(gl);

  return {
    position: positionBuffer,
    color: colorBuffer,
    index: indexBuffer,
  }
}

function initPositionBuffer(gl) {
  // Cria o buffer
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // conjunto de 4 vértices para cada lado do cubo
  const positions = [
    // Face da frente
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Face do fundo
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Face de cima
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Face de baixo
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Face da direita
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Face da esquerda
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];

  // Aplica o array de posições (vértices) dentro do buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initColorBuffer(gl) {
  // Define as cores para nosso Shader de Fragmento
  // Aplica cores para cada face do cubo
  const faceColors = [
    [0.6, 0.6, 0.6, 1.0], // Face frontal: Cinza
    [1.0, 0.0, 0.0, 1.0], // Face do fundo: Vermelho
    [0.0, 1.0, 0.0, 1.0], // Face de cima: Verde
    [0.0, 0.0, 1.0, 1.0], // Face de baixo: Azul
    [1.0, 1.0, 0.0, 1.0], // Face do topo: Verde
    [1.0, 0.0, 1.0, 1.0], // Face do topo: Roxo
  ];

  let colors = [];

  for (const color of faceColors) {
    // Aplica a cor para cada vertice da face
    colors = colors.concat(color, color, color, color);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

function initIndexBuffer(gl) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // A face é definida como uma ligação de 2 triangulos
  // O indece passado, corresponde a posição dos vertices dentro do array do positionBuffer
  const index = [
    0, 1, 2,
    0, 2, 3, // Face frontal
    4, 5, 6,
    4, 6, 7, // Face do fundo
    8, 9, 10,
    8, 10, 11, // Face de cima
    12, 13, 14,
    12, 14, 15, // Face de baixo
    16, 17, 18,
    16, 18, 19, // Face da direita
    20, 21, 22,
    20, 22, 23, // Face da esquerda
  ];

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(index),
    gl.STATIC_DRAW,
  );

  return indexBuffer;
}

export { initBuffers };
