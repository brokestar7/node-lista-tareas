require('colors');

const {guardarDB, leerDB} = require('./helpers/guardarArchivo');
const { 
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoCheckList
} = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');





const main = async() => {

    let opt = '';

    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB) { //cargar tareas

        tareas.cargarTareasFromArray(tareasDB);
        
    }

    do {
        // Imprimir el menu
        opt = await inquirerMenu();
        
        switch (opt) {

            case '1':
                //Crear opcion
            const desc = await leerInput('Descripcion:');
            tareas.crearTarea(desc);

            break;

            case '2':
                tareas.listadoCompleto();
            break;
            
            case '3': // Listar completadas
                tareas.listarPendientesCompletadas(true);
            break;
            case '4': // Listar pendientes
                tareas.listarPendientesCompletadas(false);
            break;
            case '5': // Completado | Pendiente

            const ids =  await mostrarListadoCheckList(tareas.listadoArr);
            tareas.toggleCompletadas(ids);  

            break;
            case '6': // Borrar tareas pendientes
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if(id !== '0') {
                    
                    //todo Preguntar si esta seguro
                    const ok = await confirmar('Estas seguro que deseas borrarlo?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada correctamente');
                    }
                    console.log({ok});
                }
            break;
            
        }

        guardarDB(tareas.listadoArr);

        await pausa();
        
    } while (opt !== '0');


    // pausa();

}

main();