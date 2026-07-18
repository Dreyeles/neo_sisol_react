// Mock API Interceptor for Demo Mode
// Intercepts global window.fetch calls to mock the backend completely.

const checkDemoMode = () => {
  return localStorage.getItem('demoMode') === 'true'
    || (typeof window !== 'undefined' && window.location.search.includes('demo=true'))
    || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_MOCKS === 'true');
};

// -------------------------------------------------------------
// BASE DE DATOS EN MEMORIA (LOCALSTORAGE PARA PERSISTENCIA)
// -------------------------------------------------------------
const getLocalStorageJSON = (key, defaultValue) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalStorageJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

// 1. Especialidades
const INITIAL_ESPECIALIDADES = [
  { id_especialidad: 1, nombre: 'Cardiología', descripcion: 'Enfermedades del corazón y sistema cardiovascular', id_departamento: 1 },
  { id_especialidad: 2, nombre: 'Pediatría', descripcion: 'Atención médica para bebés, niños y adolescentes', id_departamento: 1 },
  { id_especialidad: 3, nombre: 'Dermatología', descripcion: 'Diagnóstico y tratamiento de enfermedades de la piel', id_departamento: 1 },
  { id_especialidad: 4, nombre: 'Oftalmología', descripcion: 'Salud visual y tratamiento de enfermedades oculares', id_departamento: 1 },
  { id_especialidad: 5, nombre: 'Ginecología', descripcion: 'Salud reproductiva femenina', id_departamento: 1 },
  { id_especialidad: 6, nombre: 'Traumatología', descripcion: 'Tratamiento de lesiones y sistema locomotor', id_departamento: 1 }
];

// 2. Médicos
const INITIAL_MEDICOS = [
  { id_medico: 1, id_usuario: 101, dni: '11111111', nombres: 'Carlos', apellidos: 'Castro', id_especialidad: 1, especialidad: 'Cardiología', numero_colegiatura: 'CMP-45678', costo_consulta: 50.00, estado: 'activo' },
  { id_medico: 2, id_usuario: 102, dni: '22222222', nombres: 'Ana', apellidos: 'Acosta', id_especialidad: 2, especialidad: 'Pediatría', numero_colegiatura: 'CMP-56789', costo_consulta: 40.00, estado: 'activo' },
  { id_medico: 3, id_usuario: 103, dni: '33333333', nombres: 'Daniel', apellidos: 'Díaz', id_especialidad: 3, especialidad: 'Dermatología', numero_colegiatura: 'CMP-67890', costo_consulta: 60.00, estado: 'activo' },
  { id_medico: 4, id_usuario: 104, dni: '44444444', nombres: 'Isabel', apellidos: 'Iglesias', id_especialidad: 4, especialidad: 'Oftalmología', numero_colegiatura: 'CMP-78901', costo_consulta: 45.00, estado: 'activo' },
  { id_medico: 5, id_usuario: 105, dni: '55555555', nombres: 'Gabriela', apellidos: 'Gómez', id_especialidad: 5, especialidad: 'Ginecología', numero_colegiatura: 'CMP-89012', costo_consulta: 55.00, estado: 'activo' }
];

// 3. Servicios (para el admin y catálogo)
const INITIAL_SERVICIOS = [
  { id_servicio: 1, nombre: 'Consulta Médica General', costo: 30.00, duracion_minutos: 20, estado: 'activo' },
  { id_servicio: 2, nombre: 'Electrocardiograma (ECG)', costo: 80.00, duracion_minutos: 30, estado: 'activo' },
  { id_servicio: 3, nombre: 'Ecografía Obstétrica', costo: 120.00, duracion_minutos: 30, estado: 'activo' },
  { id_servicio: 4, nombre: 'Perfil Dermatológico Completo', costo: 150.00, duracion_minutos: 40, estado: 'activo' },
  { id_servicio: 5, nombre: 'Examen de Agudeza Visual', costo: 25.00, duracion_minutos: 15, estado: 'activo' }
];

// 4. Pacientes
const INITIAL_PACIENTES = [
  { id_paciente: 1, id_usuario: 201, dni: '77777777', nombres: 'Drey E.', apellidos: 'Aymituma Julca', fecha_nacimiento: '1995-10-15', genero: 'masculino', celular: '987654321', direccion: 'Av. Larco 123', distrito: 'Miraflores', alergias: 'Ninguna conocida', grupo_sanguineo: 'O+', enfermedades_cronicas: 'Ninguna' },
  { id_paciente: 2, id_usuario: 202, dni: '88888888', nombres: 'Juan', apellidos: 'Pérez', fecha_nacimiento: '1988-05-20', genero: 'masculino', celular: '912345678', direccion: 'Calle Las Flores 456', distrito: 'San Isidro', alergias: 'Penicilina', grupo_sanguineo: 'A-', enfermedades_cronicas: 'Hipertensión' }
];

// 5. Citas
const INITIAL_CITAS = [
  {
    id_cita: 1,
    id_paciente: 1,
    paciente_nombre: 'Drey E.',
    paciente_apellido: 'Aymituma Julca',
    id_medico: 1,
    medico_nombre: 'Carlos',
    medico_apellido: 'Castro',
    especialidad: 'Cardiología',
    fecha_cita: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ayer
    hora_cita: '10:00:00',
    duracion_minutos: 30,
    motivo_consulta: 'Control anual y chequeo preventivo.',
    tipo_cita: 'control',
    estado: 'completada',
    observaciones: 'Paciente en buen estado general. Presión controlada.'
  },
  {
    id_cita: 2,
    id_paciente: 1,
    paciente_nombre: 'Drey E.',
    paciente_apellido: 'Aymituma Julca',
    id_medico: 2,
    medico_nombre: 'Ana',
    medico_apellido: 'Acosta',
    especialidad: 'Pediatría',
    fecha_cita: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // pasado mañana
    hora_cita: '15:30:00',
    duracion_minutos: 30,
    motivo_consulta: 'Consulta para mi sobrino.',
    tipo_cita: 'primera_vez',
    estado: 'programada',
    observaciones: null
  }
];

// 6. Atenciones Médicas
const INITIAL_ATENCIONES = [
  {
    id_atencion: 1,
    id_cita: 1,
    id_paciente: 1,
    id_medico: 1,
    fecha_atencion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    motivo_consulta: 'Control anual y chequeo preventivo.',
    sintomas: 'Palpitaciones leves ocasionales tras ejercicio.',
    signos_vitales: { peso: '75', talla: '1.75', presion_arterial: '120/80', temperatura: '36.5' },
    diagnostico: 'Ritmo cardíaco normal. Leve cansancio por estrés.',
    codigo_cie10: 'R00.2',
    tratamiento: 'Reducir consumo de cafeína, dormir 8 horas y control en 6 meses.',
    receta_medica: '1. Paracetamol 500mg (si hay dolor de cabeza) - 1 tab cada 8h por 3 días.\n2. Complejo B - 1 tab diaria por 30 días.',
    examenes_solicitados: 'Hemograma completo, Perfil Lipídico.',
    observaciones: 'Paciente stable. Recomendaciones de estilo de vida brindadas.',
    estado: 'finalizada'
  }
];

// 7. Archivos
const INITIAL_ARCHIVOS = [
  { id_archivo: 1, id_paciente: 1, nombre_archivo: 'electrocardiograma_preventivo.pdf', fecha_subida: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), tamaño_kb: 245, url: '#' }
];

// Inicializar base de datos en localStorage dinámicamente
const checkAndInitializeDemoDb = () => {
  if (!localStorage.getItem('demo_especialidades')) setLocalStorageJSON('demo_especialidades', INITIAL_ESPECIALIDADES);
  if (!localStorage.getItem('demo_medicos')) setLocalStorageJSON('demo_medicos', INITIAL_MEDICOS);
  if (!localStorage.getItem('demo_servicios')) setLocalStorageJSON('demo_servicios', INITIAL_SERVICIOS);
  if (!localStorage.getItem('demo_pacientes')) setLocalStorageJSON('demo_pacientes', INITIAL_PACIENTES);
  if (!localStorage.getItem('demo_citas')) setLocalStorageJSON('demo_citas', INITIAL_CITAS);
  if (!localStorage.getItem('demo_atenciones')) setLocalStorageJSON('demo_atenciones', INITIAL_ATENCIONES);
  if (!localStorage.getItem('demo_archivos')) setLocalStorageJSON('demo_archivos', INITIAL_ARCHIVOS);
};

// -------------------------------------------------------------
// INTERCEPTOR GLOBAL DE FETCH
// -------------------------------------------------------------
const originalFetch = window.fetch;

window.fetch = async (input, init) => {
  if (checkDemoMode()) {
    checkAndInitializeDemoDb();
    const url = typeof input === 'string' ? input : input.url;
    const method = (init && init.method || 'GET').toUpperCase();

    // Solo interceptamos si la URL va al backend API_BASE_URL (rutas que contienen /api/)
    if (url.includes('/api/')) {
      // Obtener datos frescos de localStorage
      let especialidades = getLocalStorageJSON('demo_especialidades', INITIAL_ESPECIALIDADES);
      let medicos = getLocalStorageJSON('demo_medicos', INITIAL_MEDICOS);
      let servicios = getLocalStorageJSON('demo_servicios', INITIAL_SERVICIOS);
      let pacientes = getLocalStorageJSON('demo_pacientes', INITIAL_PACIENTES);
      let citas = getLocalStorageJSON('demo_citas', INITIAL_CITAS);
      let atenciones = getLocalStorageJSON('demo_atenciones', INITIAL_ATENCIONES);
      let archivos = getLocalStorageJSON('demo_archivos', INITIAL_ARCHIVOS);

      console.log(`%c[Demo API Request]: ${method} ${url}`, 'color: #0284c7; font-weight: bold;');

      // 1. LOGIN
      if (url.includes('/api/auth/login') && method === 'POST') {
        const body = JSON.parse(init.body);
        const email = body.email.toLowerCase();

        let mockUser = null;
        if (email.includes('admin')) {
          mockUser = {
            id_usuario: 301,
            email: 'admin@demo.com',
            nombres: 'Drey',
            apellidos: 'Admin',
            tipo_usuario: 'admin',
            id_personal_administrativo: 1
          };
        } else if (email.includes('medico') || email.includes('doctor')) {
          mockUser = {
            id_usuario: 101,
            email: 'medico@demo.com',
            nombres: 'Carlos',
            apellidos: 'Castro',
            tipo_usuario: 'medico',
            id_medico: 1
          };
        } else {
          // Por defecto Paciente
          mockUser = {
            id_usuario: 201,
            email: 'paciente@demo.com',
            nombres: 'Drey E.',
            apellidos: 'Aymituma Julca',
            tipo_usuario: 'paciente',
            id_paciente: 1
          };
        }

        return new Response(JSON.stringify({
          status: 'OK',
          message: 'Inicio de sesión exitoso',
          data: mockUser
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 2. REGISTER
      if (url.includes('/api/auth/register') && method === 'POST') {
        return new Response(JSON.stringify({
          status: 'OK',
          message: 'Registro exitoso (Simulado)'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 3. ESPECIALIDADES
      if (url.includes('/api/especialidades') && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', data: especialidades }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 4. MEDICOS
      if (url.includes('/api/medicos/por-especialidad/') && method === 'GET') {
        const parts = url.split('/');
        const id_esp = parseInt(parts[parts.length - 1], 10);
        const filtered = medicos.filter(m => m.id_especialidad === id_esp);
        return new Response(JSON.stringify({ status: 'OK', data: filtered }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/medicos') && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', data: medicos }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/medicos') && method === 'POST') {
        const body = JSON.parse(init.body);
        const newDoc = {
          id_medico: medicos.length + 1,
          id_usuario: 100 + medicos.length + 1,
          dni: body.dni,
          nombres: body.nombres,
          apellidos: body.apellidos,
          id_especialidad: parseInt(body.id_especialidad),
          especialidad: especialidades.find(e => e.id_especialidad === parseInt(body.id_especialidad))?.nombre || 'General',
          numero_colegiatura: body.numero_colegiatura,
          costo_consulta: parseFloat(body.costo_consulta || 50),
          estado: 'activo'
        };
        medicos.push(newDoc);
        setLocalStorageJSON('demo_medicos', medicos);
        return new Response(JSON.stringify({ status: 'OK', message: 'Médico creado con éxito', data: newDoc }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/medicos/') && method === 'PUT') {
        const parts = url.split('/');
        const id_med = parseInt(parts[parts.length - 1], 10);
        const body = JSON.parse(init.body);

        medicos = medicos.map(m => {
          if (m.id_medico === id_med) {
            return {
              ...m,
              ...body,
              especialidad: especialidades.find(e => e.id_especialidad === parseInt(body.id_especialidad || m.id_especialidad))?.nombre || m.especialidad
            };
          }
          return m;
        });
        setLocalStorageJSON('demo_medicos', medicos);
        return new Response(JSON.stringify({ status: 'OK', message: 'Médico actualizado con éxito' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 5. PACIENTES
      if (url.includes('/api/pacientes/perfil-medico/') && method === 'GET') {
        const parts = url.split('/');
        const id_pac = parseInt(parts[parts.length - 1], 10);
        const patient = pacientes.find(p => p.id_paciente === id_pac) || pacientes[0];
        return new Response(JSON.stringify({ status: 'OK', data: patient }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/pacientes/') && method === 'PUT') {
        const parts = url.split('/');
        const id_pac = parseInt(parts[parts.length - 1], 10);
        const body = JSON.parse(init.body);

        pacientes = pacientes.map(p => {
          if (p.id_paciente === id_pac) {
            return { ...p, ...body };
          }
          return p;
        });
        setLocalStorageJSON('demo_pacientes', pacientes);
        return new Response(JSON.stringify({ status: 'OK', message: 'Perfil actualizado con éxito' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/medicos/') && url.includes('/pacientes') && method === 'GET') {
        // Médicos viendo sus pacientes
        return new Response(JSON.stringify({ status: 'OK', data: pacientes }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/pacientes/buscar') && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', data: pacientes }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/pacientes') && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', data: pacientes }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 6. SERVICIOS
      if (url.includes('/api/servicios/departamentos') && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', data: [{ id_departamento: 1, nombre: 'Consultas y Exámenes' }] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/servicios/por-departamento/') && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', data: servicios }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/servicios') && method === 'GET') {
        return new Response(JSON.stringify({ status: 'OK', data: servicios }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/servicios/') && method === 'PUT') {
        const parts = url.split('/');
        const id_serv = parseInt(parts[parts.length - 1], 10);
        const body = JSON.parse(init.body);

        servicios = servicios.map(s => {
          if (s.id_servicio === id_serv) {
            return { ...s, ...body };
          }
          return s;
        });
        setLocalStorageJSON('demo_servicios', servicios);
        return new Response(JSON.stringify({ status: 'OK', message: 'Servicio actualizado con éxito' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 7. CITAS DISPONIBILIDAD
      if (url.includes('/api/citas/check-full-day-availability') && method === 'POST') {
        return new Response(JSON.stringify({ status: 'OK', availability: 'available' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/citas/check-availability') && method === 'POST') {
        return new Response(JSON.stringify({
          status: 'OK',
          available: true,
          message: 'Horarios disponibles en este turno.',
          cuposRestantes: 5
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 8. CITAS GENERAL
      if (url.includes('/api/citas/paciente/') && method === 'GET') {
        const parts = url.split('/');
        const id_pac = parseInt(parts[parts.length - 1], 10);
        const userCitas = citas.filter(c => c.id_paciente === id_pac);
        return new Response(JSON.stringify({ status: 'OK', data: userCitas }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/citas/medico/') && method === 'GET') {
        const parts = url.split('/');
        const id_med = parseInt(parts[parts.length - 1], 10);
        const docCitas = citas.filter(c => c.id_medico === id_med);
        return new Response(JSON.stringify({ status: 'OK', data: docCitas }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 9. PROCESAR PAGO CITA (AGENDAR)
      if (url.includes('/api/pagos/procesar') && method === 'POST') {
        const body = JSON.parse(init.body);
        const doctor = medicos.find(m => m.id_medico === parseInt(body.id_medico)) || medicos[0];
        const patient = pacientes.find(p => p.id_paciente === parseInt(body.id_paciente)) || pacientes[0];

        const newCita = {
          id_cita: citas.length + 1,
          id_paciente: patient.id_paciente,
          paciente_nombre: patient.nombres,
          paciente_apellido: patient.apellidos,
          id_medico: doctor.id_medico,
          medico_nombre: doctor.nombres,
          medico_apellido: doctor.apellidos,
          especialidad: doctor.especialidad,
          fecha_cita: body.fecha_cita,
          hora_cita: body.turno === 'mañana' ? '09:00:00' : '15:00:00',
          duracion_minutos: 30,
          motivo_consulta: body.motivo_consulta || 'Chequeo general.',
          tipo_cita: 'primera_vez',
          estado: 'programada',
          observaciones: null
        };

        citas.push(newCita);
        setLocalStorageJSON('demo_citas', citas);

        return new Response(JSON.stringify({
          status: 'OK',
          message: 'Pago procesado y cita registrada con éxito.'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 10. PROCESAR PAGO EXAMENES
      if (url.includes('/api/pagos/procesar-examenes') && method === 'POST') {
        return new Response(JSON.stringify({
          status: 'OK',
          message: 'Pago de exámenes procesado con éxito.'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 11. HISTORIAL MEDICO Y REGISTRAR ATENCION
      if (url.includes('/api/atencion/historial/') && method === 'GET') {
        const parts = url.split('/');
        const id_pac = parseInt(parts[parts.length - 1], 10);
        const userAtenciones = atenciones.filter(a => a.id_paciente === id_pac);
        return new Response(JSON.stringify({ status: 'OK', data: userAtenciones }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/atencion/registrar') && method === 'POST') {
        const body = JSON.parse(init.body);

        const newAtencion = {
          id_atencion: atenciones.length + 1,
          id_cita: parseInt(body.id_cita),
          id_paciente: parseInt(body.id_paciente),
          id_medico: parseInt(body.id_medico),
          fecha_atencion: new Date().toISOString(),
          motivo_consulta: body.motivo_consulta || 'Consulta',
          sintomas: body.sintomas || '',
          signos_vitales: body.signos_vitales || {},
          diagnostico: body.diagnostico || '',
          codigo_cie10: body.codigo_cie10 || 'Z00.0',
          tratamiento: body.tratamiento || '',
          receta_medica: body.receta_medica || '',
          examenes_solicitados: body.examenes_solicitados || '',
          observaciones: body.observaciones || '',
          estado: 'finalizada'
        };

        atenciones.push(newAtencion);
        setLocalStorageJSON('demo_atenciones', atenciones);

        // Actualizar el estado de la cita a 'completada'
        citas = citas.map(c => {
          if (c.id_cita === parseInt(body.id_cita)) {
            return { ...c, estado: 'completada', observaciones: body.diagnostico };
          }
          return c;
        });
        setLocalStorageJSON('demo_citas', citas);

        return new Response(JSON.stringify({
          status: 'OK',
          message: 'Atención médica registrada con éxito.'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 12. CAMBIAR ESTADO DE CITA
      if (url.includes('/api/citas/') && url.includes('/estado') && method === 'PUT') {
        const parts = url.split('/');
        const id_cita = parseInt(parts[parts.length - 2], 10);
        const body = JSON.parse(init.body);

        citas = citas.map(c => {
          if (c.id_cita === id_cita) {
            return { ...c, estado: body.estado, observaciones: body.observaciones || c.observaciones };
          }
          return c;
        });
        setLocalStorageJSON('demo_citas', citas);

        return new Response(JSON.stringify({
          status: 'OK',
          message: `Estado de cita actualizado a ${body.estado}.`
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 13. ARCHIVOS
      if (url.includes('/api/archivos/paciente/') && method === 'GET') {
        const parts = url.split('/');
        const id_pac = parseInt(parts[parts.length - 1], 10);
        const userArchivos = archivos.filter(a => a.id_paciente === id_pac);
        return new Response(JSON.stringify({ status: 'OK', data: userArchivos }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (url.includes('/api/archivos/upload') && method === 'POST') {
        const newFile = {
          id_archivo: archivos.length + 1,
          id_paciente: 1,
          nombre_archivo: 'reporte_medico_cargado.pdf',
          fecha_subida: new Date().toISOString(),
          tamaño_kb: 180,
          url: '#'
        };
        archivos.push(newFile);
        setLocalStorageJSON('demo_archivos', archivos);

        return new Response(JSON.stringify({
          status: 'OK',
          message: 'Archivo subido con éxito.',
          data: newFile
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return originalFetch(input, init);
  };
