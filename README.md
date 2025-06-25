# predicicion-empleados

 paso:1
primero o importamos librerías necesarias, cargamos el  CSV con datos de empleados en Google Colab. Si el  exite nprmal lo lee y muestra sus dimensiones; si no, muestra un error y detiene la ejecución. 


paso:2 

Se separa la columna objetivo, y  se  ejecuta  las columnas categórica, se identifican las columnas numéricas pader  escalar.

 paso: 3
 
 dibilos datos de entrenamiento, para que se puyedan escalar en las columnas selecionadas
 para nrmalizar sus valores


paso:4

en el paso 4 contrullo la red neuronal con la libreria de tensorflo, la red neuronal lo compilo con adan y una funcion binary_crassentropy

paso:5
en el paso 5 procedo a entrenar la red neuronal y evaluo los datos la prueba


paso:6

una  vez entrenado, procedo a guardar el modelo entrenado por tensorflowjs, puse la opcion de descarga automatica, el archivo se decargar con formato .zip

