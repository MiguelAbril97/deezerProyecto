<template>
  <div class="container">
    <h1>Home</h1>
    <p>Bienvenido a la aplicación Deezer Music Client.</p>
    <p>
      Este proyecto sirve de base para la aplicación a desarrollar como tarea
      del curso.
    </p>
    <p>
      Para facilitar el desarrollo, este proyecto ya viene configurado con
      Bootstrap, Bootstrap Icons, SASS, router y Pinia.
    </p>

    <div class="row mt-4">
      <!-- Columna Bootstrap Icons -->
      <div class="col-md-6">
        <h1>Bootstrap Icons</h1>
        <p>
          Bootstrap Icons es una biblioteca de iconos creada por el equipo de Bootstrap. 
          Proporciona una colección de iconos SVG gratuitos y de código abierto que se 
          pueden utilizar fácilmente en proyectos web.
        </p>
        <div class="text-bg-light p-3 border">
          <div class="icon-example">
            <i class="bi bi-alarm icon-style text-primary"></i>
            <code>&lt;i class="bi bi-alarm icon-style text-primary"&gt;&lt;/i&gt;</code>
          </div>
          <div class="icon-example">
            <i class="bi bi-battery-half icon-style text-warning"></i>
            <code>&lt;i class="bi bi-battery-half icon-style text-warning"&gt;&lt;/i&gt;</code>
          </div>
          <div class="icon-example">
            <i class="bi bi-cloud-sun icon-style text-warning"></i>
            <code>&lt;i class="bi bi-cloud-sun icon-style text-warning"&gt;&lt;/i&gt;</code>
          </div>
          <div class="icon-example">
            <i class="bi bi-emoji-smile icon-style text-success"></i>
            <code>&lt;i class="bi bi-emoji-smile icon-style text-success"&gt;&lt;/i&gt;</code>
          </div>
        </div>
        <p>
          Puedes encontrar la lista completa de iconos en 
          <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">
            su web oficial
          </a>.
        </p>
      </div>

      <!-- Columna SASS -->
      <div class="col-md-6">
        <h1>SASS</h1>
        <p>
          SASS (Syntactically Awesome Stylesheets) es un preprocesador de CSS que 
          permite escribir hojas de estilo de una manera más eficiente y organizada.
        </p>
        <p>
          Este proyecto ya viene configurado con SASS, por lo que puedes empezar a 
          utilizarlo en tus estilos de inmediato.
        </p>
        <div class="sass-info">
          <p>
            SASS es un preprocesador CSS que agrega características como:
          </p>
          <ul>
            <li>Anidación de estilos</li>
            <li>Variables</li>
            <li>Mixins</li>
            <li>Herencia</li>
          </ul>
          <p>Todo esto mejora la mantenibilidad del código CSS.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup></script>

<style scoped>
h1 {
  color: #007bff;
}
.sass-example {
  .psass {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;

    ul {
      margin-top: 10px;
      padding-left: 20px;
      list-style-type: square;

      li {
        margin-bottom: 5px;
        color: #555;
        font-weight: bold;

        &:hover {
          color: #007bff; 
          text-decoration: underline;
        }
      }
    }
  }
}

</style>
