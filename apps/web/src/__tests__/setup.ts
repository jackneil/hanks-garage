import '@testing-library/jest-dom';

// Mock window.matchMedia for components that use it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver for R3F components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock WebGL context for Three.js
HTMLCanvasElement.prototype.getContext = ((originalGetContext) => {
  return function (
    this: HTMLCanvasElement,
    contextId: string,
    options?: unknown
  ) {
    if (contextId === 'webgl' || contextId === 'webgl2') {
      return {
        canvas: this,
        getExtension: () => null,
        getParameter: () => null,
        createShader: () => ({}),
        createProgram: () => ({}),
        createBuffer: () => ({}),
        createTexture: () => ({}),
        createFramebuffer: () => ({}),
        createRenderbuffer: () => ({}),
        bindBuffer: () => {},
        bindTexture: () => {},
        bindFramebuffer: () => {},
        bindRenderbuffer: () => {},
        enable: () => {},
        disable: () => {},
        clear: () => {},
        viewport: () => {},
        useProgram: () => {},
        shaderSource: () => {},
        compileShader: () => {},
        attachShader: () => {},
        linkProgram: () => {},
        getProgramParameter: () => true,
        getShaderParameter: () => true,
        getUniformLocation: () => ({}),
        getAttribLocation: () => 0,
        enableVertexAttribArray: () => {},
        vertexAttribPointer: () => {},
        uniform1i: () => {},
        uniform1f: () => {},
        uniform2f: () => {},
        uniform3f: () => {},
        uniform4f: () => {},
        uniformMatrix4fv: () => {},
        drawArrays: () => {},
        drawElements: () => {},
        bufferData: () => {},
        texImage2D: () => {},
        texParameteri: () => {},
        pixelStorei: () => {},
        activeTexture: () => {},
        generateMipmap: () => {},
        deleteShader: () => {},
        deleteProgram: () => {},
        deleteBuffer: () => {},
        deleteTexture: () => {},
        deleteFramebuffer: () => {},
        deleteRenderbuffer: () => {},
        getShaderInfoLog: () => '',
        getProgramInfoLog: () => '',
        isContextLost: () => false,
      } as unknown as WebGLRenderingContext;
    }
    return originalGetContext.call(this, contextId, options);
  };
})(HTMLCanvasElement.prototype.getContext);
