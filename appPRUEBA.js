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

    const personasPorCiudad = ciudades.map(ciudad => ({
        ciudad: ciudad.nombre,
        personas: personas.filter(persona => persona.ciudadId === ciudad.id)
    }));

    const materiasPorPersona = personas.map(persona => ({
        persona: persona.nombre,
        materias: materiasPersonas.filter(mp => mp.usuarioId === persona.id).map(mp => materias.find(materia => materia.id === mp.materiaId))
    }));

    const promedioPorPersona = personas.map(persona => {
        const notasDePersona = notas.filter(nota => nota.usuarioId === persona.id);
        const promedio = notasDePersona.reduce((suma, nota) => suma + nota.valor, 0) / (notasDePersona.length || 1);
        return { persona: persona.nombre, promedio };
    });

    const personasConMaterias = personas.filter(persona => 
        materiasPersonas.some(mp => mp.usuarioId === persona.id)
    );

    console.log(personasPorCiudad);
    console.log(materiasPorPersona);
    console.log(promedioPorPersona);
    console.log(personasConMaterias);
}

cargarDatos().then((resultado) => {
    console.log(resultado);
});