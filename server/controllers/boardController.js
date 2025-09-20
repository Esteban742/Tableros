const boardService = require("../services/boardService");

// =================== Crear board ===================
const create = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  const { title, backgroundImageLink } = req.body;
  if (!(title && backgroundImageLink)) {
    return res.status(400).json({ errMessage: "Title and/or image cannot be null" });
  }

  try {
    await boardService.create(req, (err, result) => {
      if (err) return res.status(500).send(err);
      result.__v = undefined;
      return res.status(201).send(result);
    });
  } catch (err) {
    return res.status(500).json({ errMessage: "Error al crear board" });
  }
};

// =================== Obtener todos los boards ===================
const getAll = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  try {
    await boardService.getAll(req.user.id, (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ errMessage: "Error al obtener boards" });
  }
};

// =================== Obtener board por ID ===================
const getById = async (req, res) => {
  if (!req.user || !req.user.boards) {
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  const isMember = req.user.boards.includes(req.params.id);
  if (!isMember) {
    return res.status(403).json({ errMessage: "No tienes permiso para este board" });
  }

  try {
    await boardService.getById(req.params.id, (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ errMessage: "Error al obtener el board" });
  }
};

// =================== Obtener actividad por ID ===================
const getActivityById = async (req, res) => {
  if (!req.user || !req.user.boards) {
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  const isMember = req.user.boards.includes(req.params.id);
  if (!isMember) {
    return res.status(403).json({ errMessage: "No tienes permiso para este board" });
  }

  try {
    await boardService.getActivityById(req.params.id, (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ errMessage: "Error al obtener actividad del board" });
  }
};

// =================== Actualizar título ===================
const updateBoardTitle = async (req, res) => {
  if (!req.user || !req.user.boards) {
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  const isMember = req.user.boards.includes(req.params.id);
  if (!isMember) {
    return res.status(403).json({ errMessage: "No puedes cambiar el título de este board" });
  }

  const { boardId } = req.params;
  const { title } = req.body;

  try {
    await boardService.updateBoardTitle(boardId, title, req.user, (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ errMessage: "Error al actualizar título" });
  }
};

// =================== Actualizar descripción ===================
const updateBoardDescription = async (req, res) => {
  if (!req.user || !req.user.boards) {
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  const isMember = req.user.boards.includes(req.params.id);
  if (!isMember) {
    return res.status(403).json({ errMessage: "No puedes cambiar la descripción de este board" });
  }

  const { boardId } = req.params;
  const { description } = req.body;

  try {
    await boardService.updateBoardDescription(boardId, description, req.user, (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ errMessage: "Error al actualizar descripción" });
  }
};

// =================== Actualizar fondo ===================
const updateBackground = async (req, res) => {
  if (!req.user || !req.user.boards) {
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  const isMember = req.user.boards.includes(req.params.id);
  if (!isMember) {
    return res.status(403).json({ errMessage: "No puedes cambiar el fondo de este board" });
  }

  const { boardId } = req.params;
  const { background, isImage } = req.body;

  try {
    await boardService.updateBackground(boardId, background, isImage, req.user, (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).json({ errMessage: "Error al actualizar fondo" });
  }
};


// =================== Agregar miembro ===================
const addMember = async (req, res) => {
  console.log('=== DEBUG ADD MEMBER START ===');
  console.log('req.params:', req.params);
  console.log('req.body:', req.body);
  console.log('req.user:', req.user);
  
  if (!req.user || !req.user.id) {
    console.log('❌ Usuario no autenticado');
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  // Usar el parámetro correcto basado en tu ruta
  const boardId = req.params.id; // Ahora todas las rutas usan /:id
  
  console.log('Board ID extraído:', boardId);
  console.log('User boards:', req.user.boards);
  
  // Verificar si el usuario es miembro del board
  const isMember = req.user.boards && req.user.boards.includes(boardId);
  console.log('¿Es miembro?', isMember);
  
  if (!isMember) {
    console.log('❌ Usuario no es miembro del board');
    return res.status(403).json({ errMessage: "No puedes agregar miembros a este board" });
  }

  // Aceptar tanto 'email' como 'members' para flexibilidad
  const { email, members } = req.body;
  
  // Si viene un email individual, convertirlo a array
  const membersToAdd = email ? [email] : members;
  
  console.log('Miembros a agregar:', membersToAdd);
  
  if (!membersToAdd || membersToAdd.length === 0) {
    console.log('❌ No se proporcionaron miembros');
    return res.status(400).json({ errMessage: "Debe proporcionar al menos un miembro para agregar" });
  }

  try {
    await boardService.addMember(boardId, membersToAdd, req.user, (err, result) => {
      if (err) {
        console.log('❌ Error en boardService.addMember:', err);
        return res.status(400).send(err);
      }
      console.log('✅ Miembro agregado exitosamente:', result);
      return res.status(200).send(result);
    });
  } catch (err) {
    console.log('❌ Error catch en addMember:', err);
    return res.status(500).json({ errMessage: "Error al agregar miembro" });
  }
};


// =================== Eliminar miembro ===================
const removeMember = async (req, res) => {
  console.log('=== DEBUG REMOVE MEMBER START ===');
  console.log('req.params:', req.params);
  console.log('req.body:', req.body);
  console.log('req.user:', req.user);
  
  if (!req.user || !req.user.id) {
    console.log('❌ Usuario no autenticado');
    return res.status(401).json({ errMessage: "Usuario no autenticado" });
  }

  // ✅ CORREGIDO: usar req.params.id consistentemente (igual que addMember)
  const boardId = req.params.id;
  
  console.log('Board ID extraído:', boardId);
  console.log('User boards:', req.user.boards);
  
  // Verificar si el usuario es miembro del board (convertir a string para comparación)
  const userBoardsAsStrings = req.user.boards?.map(b => b.toString()) || [];
  const isMember = userBoardsAsStrings.includes(boardId.toString());
  console.log('User boards as strings:', userBoardsAsStrings);
  console.log('¿Es miembro?', isMember);
  
  if (!isMember) {
    console.log('❌ Usuario no es miembro del board');
    return res.status(403).json({ errMessage: "No puedes eliminar miembros de este board" });
  }

  const identifier = req.body; // { email } o { memberId }
  console.log('Identificador para eliminar:', identifier);

  if (!identifier || (Object.keys(identifier).length === 0)) {
    console.log('❌ No se proporcionó identificador para eliminar');
    return res.status(400).json({ errMessage: "Debe proporcionar email o memberId para eliminar" });
  }

  try {
    await boardService.removeMember(boardId, identifier, req.user, (err, result) => {
      if (err) {
        console.log('❌ Error en boardService.removeMember:', err);
        return res.status(400).send(err);
      }
      console.log('✅ Miembro eliminado exitosamente:', result);
      return res.status(200).send(result);
    });
  } catch (err) {
    console.log('❌ Error catch en removeMember:', err);
    return res.status(500).json({ errMessage: "Error al eliminar miembro" });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getActivityById,
  updateBoardTitle,
  updateBoardDescription,
  updateBackground,
  addMember,
  removeMember,
};
