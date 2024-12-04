const peticion = async (url) => {
    const respuesta = await fetch(url);
    return respuesta.json();
}

const conseguirCiudades = () => peticion('http://localhost:3000/ciudades');
const conseguirPersonas = () => peticion('http://localhost:3000/usuarios');
const conseguirMaterias = () => peticion('http://localhost:3000/materias');
const conseguirMateriasPersonas = () => peticion('http://localhost:3000/materia_usuario');
const conseguirNotas = () => peticion('http://localhost:3000/notas');

const cargarDatos = async () => {
    const [ciudades, personas, materias, materiasPersonas, notas] = await Promise.all([
        conseguirCiudades(),
        conseguirPersonas(),
        conseguirMaterias(),
        conseguirMateriasPersonas(),
        conseguirNotas()
    ]);

    const ciudadesConUsuarios = ciudades.map(ciudad => {

        const usuariosEnCiudad = personas.filter(persona => persona.ciudadId === ciudad.id);
        
        const usuariosConMateriasNotas = usuariosEnCiudad.map(usuario => {

            const materiasDelUsuario = materiasPersonas
                .filter(mp => mp.usuarioId === usuario.id)
                .map(mp => materias.find(materia => materia.id === mp.materiaId));
            
            const notasDelUsuario = notas.filter(nota => nota.usuarioId === usuario.id).map(nota => nota.valor);
            
            return {
                ...usuario,
                materias: materiasDelUsuario,
                notas: notasDelUsuario
            };
        });

        return {
            ...ciudad,
            usuarios: usuariosConMateriasNotas
        };
    });

    console.log(ciudadesConUsuarios);
}

cargarDatos().then((a) => {
    console.log(a);
});
