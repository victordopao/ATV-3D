import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

// Variáveis para manipular a rotação da câmera
var cubeRotation = 0;
var deltaTime = 0;

window.addEventListener('load', (_) => {
  // Busca o elemento canvas dentro do HTML
  const canvas = document.querySelector("#glcanvas");

  // Iniicaliza o contexto GL
  const gl = canvas.getContext("webgl");

  // Verifica se o contexto foi inicializado
  if (gl === null) {
    alert(
      "Não foi possível inicializar o contexto WebGL. Seu navegador ou sua máquina não tem suporte."
    );
    return;
  }

  /**
   * GLSL (OpenGL ES Shading Language)
   * 
   * Utilizamos a linguagem de shaders para fazer algumas definições: 
   * - cores
   * - posições
   * - forma
   * 
   * x-fragment: Utilizamos para definir a cor e iluminação da figura
   * x-vertex: Utilizamos para definir posição e forma de cada vértice da figura
   */
  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;

    // Recebemos as cores do buffer de cores
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    // Armazenamos para recuperar no shader de fragmento
    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // fragment shader program
  const fsSource = `
    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  // Executa a criação do programa Shader
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Armazena informações uteis para renderização dentro do objeto JSON
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // Constrói os objetos para renderização
  const buffers = initBuffers(gl);

  let then = 0;

  /**
   * o método requestAnimationFrame, é executado pelo navegador, 
   * esse método executa uma função de callback a cada quadro de segundo,
   * o valor que ele retorna para o método render, é o tempo em millisegundos desde que a página carregou
   */
  function render(now) {
    now *= 0.001; // Converte para segundos
    deltaTime = now - then;
    then = now;

    // Desenha a cena, enviando o angulo de rotação como parâmetro
    drawScene(gl, programInfo, buffers, cubeRotation);
    cubeRotation += deltaTime;

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
})


//
// Inicia o programa Shader para definir o x-fragment e x-vertex
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Cria o programa shader
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Não foi possível inicializar o programa Shader: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

//
// Cria os shaders de acordo com o tipo e código GLSL
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Interpreta o código fonte para o shader 
  gl.shaderSource(shader, source);

  // Faz a compilação do programa
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `Erro ao tentar compilar o shader: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

