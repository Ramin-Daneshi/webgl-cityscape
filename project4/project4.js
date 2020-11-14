// Author: Ramin Daneshi, Arif Bashar
// Assignment: Project 4
// Class: CSCI 4250
// Due: 11/6/20

var canvas, gl;

var numVertices  = 150+120+1152; // 12 vertices for 3D pyramid
var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

// Variables that control the orthographic projection bounds.
var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

var modelViewStack=[];
var modelViewMatrix = mat4();
var projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;


/*
      E ----  F
     /|     / |
    A ---  B  |
    | |    |  |
    | G----+- H
    |/     | /
    C------D/                 */
var vertices = [
        // car bottom
        vec4(-1,  0.1,  1, 1.0 ),  // A (0) 
        vec4( 3,  0.1,  1, 1.0 ),  // B (1)  
        vec4(-1.3, -0.3,  1, 1.0 ),  // C (2)  
        vec4( 4, -0.3,  1, 1.0 ), // D (3)  
        vec4( -1, 0.1, -2, 1.0 ), // E (4)  
        vec4( 3,  0.1, -2, 1.0 ), // F (5) 
        vec4( -1.3, -0.3, -2, 1.0 ), // G (6) 
        vec4( 4, -0.3, -2, 1.0 ),  // H (7) 

        // car top
        vec4(0.5,  0.5,  1, 1.0 ),  // I (8)   
        vec4( 1.5,  0.5,  1, 1.0 ),  // J (9)  
        vec4(-0.5, 0.1,  1, 1.0 ),  // K (10)  
        vec4( 2.2, 0.1,  1, 1.0 ), // L (11)  
        vec4( 0.5, 0.5, -2, 1.0 ), // M (12)  
        vec4( 1.5,  0.5, -2, 1.0 ), // N (13)  
        vec4( -0.5, 0.1, -2, 1.0 ), // O (14)  
        vec4( 2.2, 0.1, -2, 1.0 ),  // P (15)  

        // floor
        vec4(-20,  -0.5,  20, 1.0 ),  // A (16) 
        vec4( 20,  -0.5,  20, 1.0 ),  // B (17)  
        vec4(-20, -0.6,  20, 1.0 ),  // C (18)  
        vec4( 20, -0.6,  20, 1.0 ), // D (19)  
        vec4( -20, -0.5, -20, 1.0 ), // E (20)  
        vec4( 20,  -0.5, -20, 1.0 ), // F (21) 
        vec4( -20, -0.6, -20, 1.0 ), // G (22) 
        vec4( 20, -0.6, -20, 1.0 ),  // H (23) 

        // tower
        vec4(-10, -0.5, -16, 1),   // A(24)
        vec4(-3, -0.5, -16, 1),   // B(25)
        vec4(-3, 10, -16, 1),   // C(26)
        vec4(-6.5, 13, -12.5, 1), // D(27)
        vec4(-10, 10, -16, 1),    // E(28)
        vec4(-10, -0.5, -9, 1),    // F(29)
        vec4(-3, -0.5, -9, 1),    // G(30)
        vec4(-3, 10, -9, 1),    // H(31)
        vec4(-10, 10, -9, 1),     // J(32)

        // tower 2
        vec4(-11, -0.7, -6, 1),   // A(33) bottom
        vec4(-5, -0.7, -6, 1),   // B(34) bottom
        vec4(-5, 6.0, -6, 1),   // C(35) top
        vec4(-7.5, 6.2, -6, 1), // D(36) top pointy
        vec4(-11, 8.5, -6, 1),    // E(37) top
        vec4(-11, -0.7, 1, 1),    // F(38) bottom
        vec4(-5, -0.7, 1, 1),    // G(39) bottom
        vec4(-5, 6.0, 1, 1),    // H(40) top
        vec4(-7.5, 6.2, 1, 1),  // I(41) top pointy
        vec4(-11, 8.5, 1, 1),     // J(42) top

        // car2 body
        vec4(6.3,  0,  1, 1.0 ),  // A (43) 
        vec4( 11,  0.1,  1, 1.0 ),  // B (44)  
        vec4(6.5, -0.7,  1, 1.0 ),  // C (45)  
        vec4( 10.5, -0.7,  1, 1.0 ), // D (46)  
        vec4( 6.3, 0, -2, 1.0 ), // E (47)  
        vec4( 11,  0.1, -2, 1.0 ), // F (48) 
        vec4( 6.5,-0.7, -2, 1.0 ), // G (49) 
        vec4( 10.5, -0.7, -2, 1.0 ),  // H (50) 

        // car2 trapezoid
        vec4(8,  0.7,  1, 1.0 ),  // I(51)
        vec4( 10,  0.7,  1, 1.0 ),  // J(52)
        vec4(7, 0,  1, 1.0 ),  // K(53)
        vec4( 11, 0.1,  1, 1.0 ), // L(54)
        vec4( 8, 0.7, -2, 1.0 ), // M(55)
        vec4( 10,  0.7, -2, 1.0 ), // N(56)
        vec4( 7,0, -2, 1.0 ),  // O(57)
        vec4( 11, 0.1, -2, 1.0 ),  // P(58)

    ];

var pawnPoints = [
    // pawn
    [.032, .380, 0.0],
    [.043, .410, 0.0],
    [.058, .425, 0.0],
    [.066, .433, 0.0],
    [.069, .447, 0.0],
    [.093, .465, 0.0],
    [.107, .488, 0.0],
    [.106, .512, 0.0],
    [.115, .526, 0.0],
    [0, .525, 0.0],
];

var vertexColors = [
        // car bottom
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left)
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (7 front)

        // car top
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 15

        // floor
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.5, 0.5, 0.5, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 23

        // tower
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1) 32

        // tower 2
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1) 42

        // car2 bottom
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left)
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (7 front) 50

        // car2 top
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58

        // pawn
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left) 
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front) 58
    ];

//Sets up the vertices array so the pawn can be drawn
function SurfaceRevPoints()
{
	//Setup initial points matrix
	for (var i = 0; i<9; i++) {
		vertices.push(vec4(pawnPoints[i][0], pawnPoints[i][1], pawnPoints[i][2], 1));
	}

	var r;
    var t=Math.PI/12;

    // sweep the original curve another "angle" degree
	for (var j = 0; j < 24; j++) {
        var angle = (j+1)*t; 

        // for each sweeping step, generate 25 new points corresponding to the original points
		for(var i = 59; i < 68; i++ ) {	
		    r = vertices[i][0];
            vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
		}    	
	}

    var N=9; 
    // quad strips are formed slice by slice (not layer by layer)
    //          ith slice      (i+1)th slice
    //            i*N+(j+1)-----(i+1)*N+(j+1)
    //               |              |
    //               |              |
    //            i*N+j --------(i+1)*N+j
    // define each quad in counter-clockwise rotation of the vertices
    for (var i=0; i<24; i++) { // slices
        for (var j=59; j<67; j++) { // layers
            pawnQuad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1)); 
        }
    }    
}


// quad uses first index to set color for face
function quad(a, b, c, d) {

    // var t1 = subtract(vertices[b], vertices[a]);
    // var t2 = subtract(vertices[c], vertices[b]);
    // var normal = cross(t1, t2);
    // var normal = vec3(normal);
    // normal = normalize(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]); 
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[b]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[c]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal);   
    
    pointsArray.push(vertices[a]); 
    colorsArray.push(vertexColors[a]); 
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[c]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[d]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal);    
}

function pawnQuad(a, b, c, d) {

    var indices=[a, b, c, d];
    //var normal = Newell(indices);

    // triangle a-b-c
    pointsArray.push(vertices[a]); 
    colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    //normalsArray.push(normal); 

    pointsArray.push(vertices[b]); 
    colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    //normalsArray.push(normal); 

    pointsArray.push(vertices[c]); 
    colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    //normalsArray.push(normal);   

    // triangle a-c-d
    pointsArray.push(vertices[a]);  
    colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    //normalsArray.push(normal); 

    pointsArray.push(vertices[c]); 
    colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    //normalsArray.push(normal); 

    pointsArray.push(vertices[d]); 
    colorsArray.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
    //normalsArray.push(normal);    
}

function pentagon(a, b, c, d, e) {

    // var t1 = subtract(vertices[b], vertices[a]);
    // var t2 = subtract(vertices[c], vertices[b]);
    // var normal = cross(t1, t2);
    // var normal = vec3(normal);
    // normal = normalize(normal);

    pointsArray.push(vertices[a]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[b]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[c]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal);   

    pointsArray.push(vertices[a]);  
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[c]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[d]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal);    

    pointsArray.push(vertices[a]); 
    colorsArray.push(vertexColors[a]); 
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[d]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[e]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal);    
}

function triangle(a, b, c) {

    // var t1 = subtract(vertices[b], vertices[a]);
    // var t2 = subtract(vertices[c], vertices[b]);
    // var normal = cross(t1, t2);
    // var normal = vec3(normal);
    // normal = normalize(normal);

    pointsArray.push(vertices[a]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[b]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal); 
    
    pointsArray.push(vertices[c]); 
    colorsArray.push(vertexColors[a]);
    // normalsArray.push(normal);   
}

function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++) {
       index=indices[i];
       nextIndex = indices[(i+1)%L];
       
       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

// Each face is formed with two triangles
function GenerateCar() {
    // car bottom
    // starts at index 0
    quad( 0, 1, 3, 2 );  // front(ABDC) red
    quad( 4, 5, 7, 6 );  // back(EFHG)  magenta
    quad( 3, 1, 5, 7 );  // right (DBFH) blue
    quad( 6, 2, 0, 4 );  // left (GCAE) yellow
    quad( 2, 6, 7, 3 ); // bottom (CGHD) green
    quad( 5, 4, 0, 1); // top (AEFB) cyan
    // ends at index 35

    // car top
    quad( 8, 9, 11, 10 );  // front(IJLK) red
    quad( 9, 8, 12, 13 );  // back(JIMN)  magenta
    quad( 12, 13, 15, 14 );  // right (MNPO) blue
    quad( 10, 8, 12, 14 );  // left (OKIM) yellow   GCAE
    quad( 11, 10, 14, 15 ); // bottom (LKOP) green
    quad( 13, 9, 11, 15); // top (NJLP) cyan   HDBF
    // ends at index 71

    // floor
    quad( 16, 17, 19, 18 );  // front(IJLK) red
    quad( 17, 16, 20, 21 );  // back(JIMN)  magenta
    quad( 18, 16, 20, 22 );  // right (MNPO) blue
    quad( 20, 22, 23, 21 );  // left (OKIM) yellow   GCAE
    quad( 19, 17, 21, 23 ); // bottom (LKOP) green
    quad( 19, 18, 22, 23 ); // top (NJLP) cyan   HDBF
    // ends at index 107

    // car2 bottom
    quad( 43, 44, 46, 45 );  // front(ABDC) red
    quad( 47, 48, 50, 49 );  // back(EFHG)  magenta
    quad( 46, 44, 48, 50 );  // right (DBFH) blue
    quad( 49, 45, 43, 47 );  // left (GCAE) yellow
    quad( 45, 49, 50, 46 ); // bottom (CGHD) green
    quad( 48, 47, 43, 44); // top (AEFB) cyan
    // ends at index 143

    // car2 top
    quad( 51, 52, 54, 53 );  // front(IJLK) red
    quad( 52, 51, 55, 56 );  // back(JIMN)  magenta
    quad( 55, 56, 58, 57 );  // right (MNPO) blue
    quad( 53, 51, 55, 57 );  // left (OKIM) yellow   GCAE
    quad( 54, 53, 57, 58 ); // bottom (LKOP) green
    quad( 56, 52, 54, 58); // top (NJLP) cyan   HDBF
    // ends at index 179
}

function GenerateTower()
{
    // starts at index 108
    quad(24, 29, 32, 28); // left side
    quad(24, 25, 30, 29); // bottom
    quad(29, 30, 31, 32); // front
    quad(25, 26, 31, 30); // right
    quad(26, 25, 24, 28); // back
    // ends at index 138
    
    
    triangle(31, 32, 27); // front triangle
    triangle(26, 31, 27);   // right triangle
    triangle(28, 26, 27); // back triangle
    triangle(32, 28, 27); // left triangle
    // ends at index 150


    // tower 2
    quad(33, 38, 42, 37);
    quad(36, 37, 42, 41);
    quad(35, 36, 41, 40);
    quad(34, 35, 40, 39);
    quad(33, 34, 39, 38);
    pentagon (38, 39, 40, 41, 42);
    pentagon (33, 37, 36, 35, 34);
}


// namespace contain all the project information
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 4,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    GenerateCar();  // generate the points for the car and floor
    GenerateTower(); // generate the points for the tower
    SurfaceRevPoints(); // generate pawn

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });

    //************************************************************************************
    //* When you click a mouse button, set it so that only that button is seen as
    //* pressed in AllInfo. Then set the position. The idea behind this and the mousemove
    //* event handler's functionality is that each update we see how much the mouse moved
    //* and adjust the camera value by that amount.
    //************************************************************************************
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });
    

    render();
}


function DrawCars() {
    var s, r, t;

    modelViewStack.push(modelViewMatrix);
    t = translate(10, 10, 10);
    modelViewMatrix = mult(modelViewMatrix, t);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 72);
    modelViewMatrix = modelViewStack.pop();
}


var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);
var eye = vec3(2, 2, 2);

var eyeX=2, eyeY=2, eyeZ=2; // default eye position input values

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Setup the projection matrix.
    // Study 1) Use a fixed viewing volume
    // projectionMatrix = ortho(-8, 8, -8, 8, -20, 20);
    // Study 2) Use a viewing volume changed via mouse movements
    projectionMatrix = ortho( x_min*AllInfo.zoomFactor - AllInfo.translateX,
                              x_max*AllInfo.zoomFactor - AllInfo.translateX,
                              y_min*AllInfo.zoomFactor - AllInfo.translateY,
                              y_max*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Setup the initial model-view matrix.

    // study 1) learn the effect of eye position by entering specific eye positions from user interface
    //eye= vec3(eyeX, eyeY, eyeZ);

    // Study 2) Setup the eye to move around different points on a sphere
    eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));

    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    DrawCars();

    gl.drawArrays( gl.TRIANGLES, 72, numVertices-72 );
}


function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}