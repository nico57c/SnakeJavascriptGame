

function test(gl, canvas) {
    var vertices = [
        -1,-1,-1, 1,-1,-1, 1, 1,-1, -1, 1,-1,
        -1,-1, 1, 1,-1, 1, 1, 1, 1, -1, 1, 1,
        -1,-1,-1, -1, 1,-1, -1, 1, 1, -1,-1, 1,
        1,-1,-1, 1, 1,-1, 1, 1, 1, 1,-1, 1,
        -1,-1,-1, -1,-1, 1, 1,-1, 1, 1,-1,-1,
        -1, 1,-1, -1, 1, 1, 1, 1, 1, 1, 1,-1,
    ];

    var colors = [
       5,3,7, 5,3,7, 5,3,7, 5,3,7,
       1,1,3, 1,1,3, 1,1,3, 1,1,3,
       0,0,1, 0,0,1, 0,0,1, 0,0,1,
       1,0,0, 1,0,0, 1,0,0, 1,0,0,
       1,1,0, 1,1,0, 1,1,0, 1,1,0,
       0,1,0, 0,1,0, 0,1,0, 0,1,0
    ];

    var  indices = [
        0,1,2, 0,2,3, 4,5,6, 4,6,7,
        8,9,10, 8,10,11, 12,13,14, 12,14,15,
        16,17,18, 16,18,19, 20,21,22, 20,22,23
    ];

    // Create an empty buffer object to store the vertex buffer
    var vertex_buffer = gl.createBuffer();
    var index_buffer = gl.createBuffer();

    //Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    // Create and store data into color buffer
      var color_buffer = gl.createBuffer ();
      gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Unbind the buffer
    //gl.bindBuffer(gl.ARRAY_BUFFER, null);



    /*=========================Shaders========================*/

    // vertex shader source code
    /*var vertCode = '\
       attribute vec3 coordinates;\
       void main(void) {\
          gl_Position = vec4(coordinates, 1.0);\
          gl_PointSize = 10.0;\
       }\
    ';*/

    var vertCode = 'attribute vec3 position;'+
       'uniform mat4 Pmatrix;'+
       'uniform mat4 Vmatrix;'+
       'uniform mat4 Mmatrix;'+
       'attribute vec3 color;'+//the color of the point
       'varying vec3 vColor;'+

       'void main(void) { '+//pre-built function
          'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);'+
          'vColor = color;'+
       '}';

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

    // fragment shader source code
    /*var fragCode = '\
       void main(void) {\
           gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);\
       }';*/

   var fragCode = 'precision mediump float;'+
      'varying vec3 vColor;'+
      'void main(void) {'+
         'gl_FragColor = vec4(vColor, 1.);'+
      '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    /*======== Associating shaders to buffer objects ========*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "position");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    var color = gl.getAttribLocation(shaderProgram, "color");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;

    // Color
    gl.enableVertexAttribArray(color);
    gl.useProgram(shaderProgram);

    /*============= Drawing the primitive ===============*/

    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(200,50,canvas.width,canvas.height);

    gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT,0);
    gl.drawArrays(gl.LINE_LOOP, 0, 3);


    var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
    var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
    var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

    /*==================== MATRIX =====================*/

    function get_projection(angle, a, zMin, zMax) {
       var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
       return [
          0.5/ang, 0 , 0, 0,
          0, 0.5*a/ang, 0, 0,
          0, 0, -(zMax+zMin)/(zMax-zMin), -1,
          0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
       ];
    }

    var proj_matrix = get_projection(40, canvas.width/canvas.height, .1, 100);

    var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    var view_matrix = [1,0,0,0, 0,1,0,0, .25,.25,1,0, 0,0,0,1];

    // translating z
    view_matrix[14] = view_matrix[14]-10;//zoom

    /*==================== Rotation ====================*/

    function rotateZ(m, angle) {
       var c = Math.cos(angle);
       var s = Math.sin(angle);
       var mv0 = m[0], mv4 = m[4], mv8 = m[8];

       m[0] = c*m[0]-s*m[1];
       m[4] = c*m[4]-s*m[5];
       m[8] = c*m[8]-s*m[9];

       m[1]=c*m[1]+s*mv0;
       m[5]=c*m[5]+s*mv4;
       m[9]=c*m[9]+s*mv8;
    }

    function rotateX(m, angle) {
       var c = Math.cos(angle);
       var s = Math.sin(angle);
       var mv1 = m[1], mv5 = m[5], mv9 = m[9];

       m[1] = m[1]*c-m[2]*s;
       m[5] = m[5]*c-m[6]*s;
       m[9] = m[9]*c-m[10]*s;

       m[2] = m[2]*c+mv1*s;
       m[6] = m[6]*c+mv5*s;
       m[10] = m[10]*c+mv9*s;
    }

    function rotateY(m, angle) {
       var c = Math.cos(angle);
       var s = Math.sin(angle);
       var mv0 = m[0], mv4 = m[4], mv8 = m[8];

       m[0] = c*m[0]+s*m[2];
       m[4] = c*m[4]+s*m[6];
       m[8] = c*m[8]+s*m[10];

       m[2] = c*m[2]-s*mv0;
       m[6] = c*m[6]-s*mv4;
       m[10] = c*m[10]-s*mv8;
    }

    /*================= Drawing ===========================*/
    var time_old = 0;
    var animAngle = 0;
    var animAngleSens = true;
    var animate = function(time) {


       var dt = time-time_old;
       //rotateZ(mov_matrix, dt*0.005);//time
       //rotateY(mov_matrix, dt*0.0005);
       if(animAngle<.0025 && animAngleSens){
           animAngleSens = true;
           animAngle+=.0001;
       } else {
           animAngleSens = false;
           animAngle=-.0025;
           if(animAngle<=-.0025){
               animAngleSens = true;
           }
       }

       rotateX(mov_matrix, animAngle);
       time_old = time;

       gl.enable(gl.DEPTH_TEST);
       gl.depthFunc(gl.LEQUAL);
       gl.clearColor(0.5, 0.5, 0.5, 0.9);
       gl.clearDepth(1.0);

       gl.viewport(0, 0, canvas.width, canvas.height);
       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
       gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
       gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
       gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
       gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

       window.requestAnimationFrame(animate);
    }
    animate(0);

}
