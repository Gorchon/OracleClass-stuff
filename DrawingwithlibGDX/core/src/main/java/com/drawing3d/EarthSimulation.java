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
import com.badlogic.gdx.graphics.g3d.utils.CameraInputController;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.environment.DirectionalLight;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.graphics.g3d.Material;
import com.badlogic.gdx.graphics.VertexAttributes;
import com.badlogic.gdx.graphics.g3d.attributes.TextureAttribute;

public class EarthSimulation extends ApplicationAdapter {
    // 5. Cámara, controlador, batch y entorno
    public PerspectiveCamera camera;
    public CameraInputController camController;
    public ModelBatch modelBatch;
    public Environment environment;

    // 6. Modelo, instancia y textura de la Tierra
    public Model earthModel;
    public ModelInstance earthInstance;
    public Texture earthTexture;

    // 7. Ángulo, radio y velocidad de rotación
    private float rotationAngle = 0;
    private final float EARTH_RADIUS = 5f;
    private final float ROTATION_SPEED = 10f; // grados por segundo

    @Override
    public void create() {
        // 9. Configurar cámara y controlador
        camera = new PerspectiveCamera(
                67,
                Gdx.graphics.getWidth(),
                Gdx.graphics.getHeight());
        camera.position.set(0f, 0f, 15f);
        camera.lookAt(0f, 0f, 0f);
        camera.near = 0.1f;
        camera.far = 300f;
        camera.update();

        camController = new CameraInputController(camera);
        Gdx.input.setInputProcessor(camController);

        // 10. Configurar renderizado y luces
        modelBatch = new ModelBatch();
        environment = new Environment();
        environment.set(new ColorAttribute(
                ColorAttribute.AmbientLight,
                0.4f, 0.4f, 0.4f, 1f));
        environment.add(new DirectionalLight()
                .set(0.8f, 0.8f, 0.8f, -1f, -0.8f, -0.2f));

        // 11. Cargar textura y crear modelo de esfera
        earthTexture = new Texture(Gdx.files.internal("earth.jpg"));
        ModelBuilder modelBuilder = new ModelBuilder();
        earthModel = modelBuilder.createSphere(
                EARTH_RADIUS, EARTH_RADIUS, EARTH_RADIUS,
                64, 64, // divisiones para suavidad
                new Material(TextureAttribute.createDiffuse(earthTexture)),
                VertexAttributes.Usage.Position
                        | VertexAttributes.Usage.Normal
                        | VertexAttributes.Usage.TextureCoordinates);
        earthInstance = new ModelInstance(earthModel);
    }

    @Override
    public void render() {
        // 13. Actualizar rotación
        rotationAngle += ROTATION_SPEED * Gdx.graphics.getDeltaTime();
        earthInstance.transform.setToRotation(Vector3.Y, rotationAngle);

        // 13. Limpiar pantalla
        Gdx.gl.glViewport(
                0, 0,
                Gdx.graphics.getWidth(),
                Gdx.graphics.getHeight());
        Gdx.gl.glClear(
                GL20.GL_COLOR_BUFFER_BIT
                        | GL20.GL_DEPTH_BUFFER_BIT);

        // 13. Renderizar Tierra
        modelBatch.begin(camera);
        modelBatch.render(earthInstance, environment);
        modelBatch.end();

        // 13. Actualizar controlador de cámara
        camController.update();
    }

    @Override
    public void dispose() {
        // 14. Liberar recursos
        modelBatch.dispose();
        earthModel.dispose();
        earthTexture.dispose();
    }

    @Override
    public void resize(int width, int height) {
        // 14. Manejar cambio de tamaño
        camera.viewportWidth = width;
        camera.viewportHeight = height;
        camera.update();
    }
}
