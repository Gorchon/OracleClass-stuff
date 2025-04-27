package com.drawing3d;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.graphics.PerspectiveCamera;

import com.badlogic.gdx.graphics.g3d.Environment;
import com.badlogic.gdx.graphics.g3d.ModelBatch;
import com.badlogic.gdx.graphics.g3d.Model;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.graphics.g3d.environment.DirectionalLight;
import com.badlogic.gdx.graphics.g3d.environment.PointLight;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.attributes.FloatAttribute;
import com.badlogic.gdx.graphics.g3d.attributes.TextureAttribute;
import com.badlogic.gdx.graphics.g3d.utils.CameraInputController;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.graphics.VertexAttributes;

public class SolarSystem extends ApplicationAdapter {
    // 5. Cámara, controlador, batch y entorno
    public PerspectiveCamera camera;
    public CameraInputController camController;
    public ModelBatch modelBatch;
    public Environment environment;

    // 6. Modelos, instancias y texturas
    public Model sunModel, earthModel, moonModel;
    public ModelInstance sunInstance, earthInstance, moonInstance;
    public Texture sunTexture, earthTexture, moonTexture;

    // 7. Rotaciones y órbitas
    private float earthRotation = 0;
    private float earthOrbit = 0;
    private float moonRotation = 0;
    private float moonOrbit = 0;

    // 8. Radios y velocidades (no a escala)
    private final float SUN_RADIUS = 8f;
    private final float EARTH_RADIUS = 2f;
    private final float MOON_RADIUS = 0.5f;
    private final float EARTH_ORBIT_RADIUS = 20f;
    private final float MOON_ORBIT_RADIUS = 4f;
    private final float EARTH_ROTATION_SPEED = 50f; // °/s
    private final float EARTH_ORBIT_SPEED = 10f; // °/s
    private final float MOON_ROTATION_SPEED = 5f; // °/s
    private final float MOON_ORBIT_SPEED = 40f; // °/s

    // 9. Carga las texturas
    private void loadTextures() {
        sunTexture = new Texture(Gdx.files.internal("sun.png"));
        earthTexture = new Texture(Gdx.files.internal("earth.jpg"));
        moonTexture = new Texture(Gdx.files.internal("moon.jpg"));
    }

    // 10. Crea los modelos y sus instancias
    private void createModels() {
        ModelBuilder modelBuilder = new ModelBuilder();

        // Sol (esfera emisiva)
        sunModel = modelBuilder.createSphere(
                SUN_RADIUS, SUN_RADIUS, SUN_RADIUS,
                64, 64,
                new com.badlogic.gdx.graphics.g3d.Material(
                        TextureAttribute.createDiffuse(sunTexture),
                        ColorAttribute.createEmissive(1f, 0.9f, 0.9f, 1f),
                        FloatAttribute.createShininess(0f)),
                VertexAttributes.Usage.Position
                        | VertexAttributes.Usage.Normal
                        | VertexAttributes.Usage.TextureCoordinates);

        // Tierra
        earthModel = modelBuilder.createSphere(
                EARTH_RADIUS, EARTH_RADIUS, EARTH_RADIUS,
                64, 64,
                new com.badlogic.gdx.graphics.g3d.Material(
                        TextureAttribute.createDiffuse(earthTexture)),
                VertexAttributes.Usage.Position
                        | VertexAttributes.Usage.Normal
                        | VertexAttributes.Usage.TextureCoordinates);

        // Luna
        moonModel = modelBuilder.createSphere(
                MOON_RADIUS, MOON_RADIUS, MOON_RADIUS,
                32, 32,
                new com.badlogic.gdx.graphics.g3d.Material(
                        TextureAttribute.createDiffuse(moonTexture)),
                VertexAttributes.Usage.Position
                        | VertexAttributes.Usage.Normal
                        | VertexAttributes.Usage.TextureCoordinates);

        // Instancias
        sunInstance = new ModelInstance(sunModel);
        earthInstance = new ModelInstance(earthModel);
        moonInstance = new ModelInstance(moonModel);

        // Prepara el batch
        modelBatch = new ModelBatch();
    }

    // 11. Configura la cámara y su controlador
    private void setupCamera() {
        camera = new PerspectiveCamera(
                67,
                Gdx.graphics.getWidth(),
                Gdx.graphics.getHeight());
        camera.position.set(0f, 30f, 50f);
        camera.lookAt(0f, 0f, 0f);
        camera.near = 0.1f;
        camera.far = 500f;
        camera.update();

        camController = new CameraInputController(camera);
        Gdx.input.setInputProcessor(camController);
    }

    // 12. Configura la iluminación
    private void setupLighting() {
        environment = new Environment();
        // Luz ambiental tenue
        environment.set(ColorAttribute.createAmbientLight(0.1f, 0.1f, 0.1f, 1f));

        // Luz direccional (sol)
        Color sunLightColor = new Color(1f, 0.9f, 0.9f, 1f);
        Vector3 lightDir = new Vector3(-1f, -0.8f, -0.2f).nor();
        environment.add(new DirectionalLight().set(sunLightColor, lightDir));

        // Punto de luz alrededor del sol
        environment.add(new PointLight()
                .set(sunLightColor,
                        sunInstance.transform.getTranslation(new Vector3()),
                        SUN_RADIUS * 200f));
    }

    // 13. Inicializa todo
    @Override
    public void create() {
        loadTextures();
        createModels();
        setupCamera();
        setupLighting();
    }

    // 14. Actualiza posiciones y rotaciones
    private void updateCelestialBodies() {
        float delta = Gdx.graphics.getDeltaTime();

        earthRotation += EARTH_ROTATION_SPEED * delta;
        earthOrbit += EARTH_ORBIT_SPEED * delta;
        moonRotation += MOON_ROTATION_SPEED * delta;
        moonOrbit += MOON_ORBIT_SPEED * delta;

        // Sol gira despacio
        sunInstance.transform.setToRotation(Vector3.Y, earthOrbit * 0.1f);

        // Tierra orbita al sol
        earthInstance.transform.idt()
                .translate(
                        (float) Math.cos(Math.toRadians(earthOrbit)) * EARTH_ORBIT_RADIUS,
                        0f,
                        (float) Math.sin(Math.toRadians(earthOrbit)) * EARTH_ORBIT_RADIUS)
                .rotate(Vector3.Y, earthRotation)
                .rotate(Vector3.Z, 23.5f);

        // Luna orbita la Tierra
        Vector3 earthPos = earthInstance.transform.getTranslation(new Vector3());
        moonInstance.transform.idt()
                .translate(earthPos)
                .translate(
                        (float) Math.cos(Math.toRadians(moonOrbit)) * MOON_ORBIT_RADIUS,
                        0f,
                        (float) Math.sin(Math.toRadians(moonOrbit)) * MOON_ORBIT_RADIUS)
                .rotate(Vector3.Y, moonRotation);
    }

    // 15. Renderiza la escena
    @Override
    public void render() {
        updateCelestialBodies();

        // FONDO
        Gdx.gl.glClearColor(0.05f, 0.05f, 0.1f, 1f);
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);

        modelBatch.begin(camera);
        // Cuerpos celestes
        modelBatch.render(sunInstance, environment);
        modelBatch.render(earthInstance, environment);
        modelBatch.render(moonInstance, environment);

        // Efecto de brillo del sol
        if (modelBatch instanceof ModelBatch) {
            sunInstance.materials.get(0)
                    .set(ColorAttribute.createEmissive(1f, 0.7f, 0.4f, 1f));
            modelBatch.render(sunInstance);
            sunInstance.materials.get(0)
                    .set(ColorAttribute.createEmissive(0.8f, 0.5f, 0.3f, 1f));
        }
        modelBatch.end();

        camController.update();
    }

    // 16. Limpieza y resize
    @Override
    public void dispose() {
        modelBatch.dispose();
        sunModel.dispose();
        earthModel.dispose();
        moonModel.dispose();
        sunTexture.dispose();
        earthTexture.dispose();
        moonTexture.dispose();
    }

    @Override
    public void resize(int width, int height) {
        camera.viewportWidth = width;
        camera.viewportHeight = height;
        camera.update();
    }
}
