var camera, renderer, scene;

window.onload = init;

function init() {

    // Add listeners
    window.addEventListener( 'resize', onWindowResize, false );

    createViewer();
    loadUrlParams();
    populateAlgorithmSelectList();
    populateShapeSelectList();
    animate();

}

function createViewer(){

    var controls;
    var container = document.getElementById('container');

    var width = window.innerWidth;
    var height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    // ambient light
    var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    // directional light
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-1, 0.5, 1);
    scene.add(directionalLight);

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, PAN: THREE.MOUSE.MIDDLE };

}

// render
function render() {
    renderer.render( scene, camera );
}

// animate
function animate() {
    requestAnimationFrame( animate );
    render();
}

/**
 * On window resize callback
 */
function onWindowResize() {
    var width = window.innerWidth,
        height = window.innerHeight;

    for( var i = 0; i < 4; i++ ) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );
    }
}

/**
 * On load callback
 */
function onLoad( shape ) {

    var index, geometry, material, mesh, wireFrame, box, algorithm;

    index = urlParams['algorithm'];

    setShapeUtils( index );

    algorithm = algorithms[ index ];

    try {

        geometry = shape.makeGeometry();

    } catch( error ){

        console.timeEnd( algorithm );

        console.warn( algorithm + " failed: " + error.message );

    }

    material = new THREE.MeshBasicMaterial({color: 0xff0000});

    mesh = new THREE.Mesh(geometry, material);

    wireFrame = new THREE.WireframeHelper( mesh, 0xffffff );

    geometry.computeBoundingBox();

    box = geometry.boundingBox;

    mesh.position.copy( box.center().negate() );

    camera.position.setZ(Math.abs(Math.max(box.max.x - box.min.x, box.max.y - box.min.y)) * 1.5);

    scene.add(wireFrame);

    scene.add(mesh);

}

/**
 * Populate algorithm select list
 */
function populateAlgorithmSelectList(){

    var i, algorithm, option,
        select = document.getElementById('algorithm_select');

    for ( i = 0; i < 4; i++) {

        algorithm = algorithms[i];

        option = document.createElement('option');

        option.textContent = algorithm;

        option.value = i;

        console.log( urlParams );

        if ('algorithm' in urlParams && option.value == urlParams['algorithm']) {

            console.log( option.value );

            option.selected = true;

        }

        select.appendChild(option);

    }

}