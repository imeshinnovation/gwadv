const loadPage = (page) => {
    $("#master").load(page);
}

$(document).ready(function () {
    $("#success-alert").fadeTo(2000, 500).slideUp(1000, function () {
        $("#success-alert").slideUp(1000)
    })
})

const updPasswd = (id, names) => {
    const modalx = document.createElement("div")
    modalx.id = "updPModal" + id
    modalx.setAttribute("tabindex", "-1")
    modalx.setAttribute("aria-labelledby", "updPModalLabel" + id)
    modalx.setAttribute("aria-hidden", "true")
    modalx.setAttribute("class", "modal fade")
    modalx.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="updPModalLabel${id}">Cambiar la Contraseña</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4>${names}</h4>
                    <input type="hidden" id="updPID" value="${id}">
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-key fa-fw"></i></div>
                        <input type="password" id="updPPasswd" class="form-control" placeholder="Contraseña" value="" autocomplete="off">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="updPBut">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `
    document.body.appendChild(modalx)
    setTimeout(() => {
        $("#updPModal" + id).modal('show')
    }, 1000)

    $('#updPModal' + id).on('hidden.bs.modal', function () {
        $('#updPModal' + id).remove();
    });

    $("#updPBut").on('click', function () {
        const id = document.getElementById('updPID')
        const password = document.getElementById('updPPasswd')

        if (!password.value) {
            showAlert('Debes Competar todos los Campos', 'warning')
        } else {
            const datos = {
                id: id.value,
                password: password.value
            }
            $.ajax({
                type: "POST",
                url: "/updpasswd",
                data: datos
            }).done(function (data) {
                if (data.msg == 'ok') {
                    showAlert('Contraseña Actualizada!', 'success')
                    $('#updPModal' + id.value).modal('hide', function () {
                        loadPage('/config')
                    })
                }
            }).fail(function () {
                showAlert("Error: No se pudo Actualizar la Contraseña", "danger")
                loadPage('/config')
            })

        }


    })
}

function newUser(title) {
    var modaler = document.createElement("div")
    modaler.id = "userModal"
    modaler.setAttribute("tabindex", "-1")
    modaler.setAttribute("aria-labelledby", "usersModalLabel")
    modaler.setAttribute("aria-hidden", "true")
    modaler.setAttribute("class", "modal fade")
    modaler.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="usersModalLabel">${title}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-user fa-fw"></i></div>
                        <input type="text" id="addNames" class="form-control" placeholder="Nombre del Usuario" value="" autocomplete="off">
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-envelope fa-fw"></i></div>
                        <input type="email" id="addEmail" class="form-control" placeholder="Correo Electrónico" value="" autocomplete="off">
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-key fa-fw"></i></div>
                        <input type="password" id="addPasswd" class="form-control" placeholder="Contraseña" value="" autocomplete="off">
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-user-shield fa-fw"></i></div>
                        <select class="form-select" id="addRoll">
                            <option value="">Seleccione un Roll</option>
                            <option value="1">Administrador</option>
                            <option value="2">Auditor</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="saveBut">Crear Usuario</button>
                </div>
            </div>
        </div>
    `
    document.body.appendChild(modaler)
    setTimeout(() => {
        $("#userModal").modal('show')
    }, 1000)

    $('#userModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });

    $("#saveBut").on('click', function () {
        const names = document.getElementById('addNames')
        const email = document.getElementById('addEmail')
        const password = document.getElementById('addPasswd')
        const roll = document.getElementById('addRoll')

        if (!names.value || !email.value || !password.value) {
            showAlert('Debes Competar todos los Campos', 'warning')
        } else {
            const datos = {
                names: names.value,
                email: email.value,
                password: password.value,
                roll: roll.value
            }
            $.ajax({
                type: "POST",
                url: "/adduser",
                data: datos
            }).done(function (data) {
                if (data.msg == 'ok') {
                    showAlert('Usuario Creado Correctamente!', 'success')
                    $("#userModal").modal('hide')
                    loadPage('/config')
                }
            }).fail(function () {
                showAlert("Error: No se pudo Crear el Usuario", "danger")
                loadPage('/config')
            })

        }


    })
}

function newPozo() {
    var modaler = document.createElement("div")
    modaler.id = "pozoModal"
    modaler.setAttribute("tabindex", "-1")
    modaler.setAttribute("aria-labelledby", "pozoModalLabel")
    modaler.setAttribute("aria-hidden", "true")
    modaler.setAttribute("class", "modal fade")
    modaler.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="pozoModalLabel">Agregar Nuevo Pozo</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-font fa-fw"></i></div>
                        <input type="text" id="pozoNames" class="form-control" placeholder="Nombre del Pozo" value="" autocomplete="off">
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-map fa-fw"></i></div>
                        <input type="text" id="pozoUbicacion" class="form-control" placeholder="Ubicación del Pozo" value="" autocomplete="off">
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-text"><i class="fas fa-rotate fa-fw"></i></div>
                        <select class="form-select" id="pozoEstado">
                            <option value="">Seleccione un Estado</option>
                            <option value="1">Activo</option>
                            <option value="2">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="savePozo">Crear Pozo</button>
                </div>
            </div>
        </div>
    `
    document.body.appendChild(modaler)
    setTimeout(() => {
        $("#pozoModal").modal('show')
    }, 1000)

    $('#pozoModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });

    $("#savePozo").on('click', function () {
        const names = document.getElementById('pozoNames')
        const ubicacion = document.getElementById('pozoUbicacion')
        const estado = document.getElementById('pozoEstado')

        if (!names.value || !ubicacion.value || !estado.value) {
            showAlert('Debes Competar todos los Campos', 'warning')
        } else {
            const datos = {
                name: names.value,
                ubicacion: ubicacion.value,
                estado: estado.value
            }
            $.ajax({
                type: "POST",
                url: "/addpozo",
                data: datos
            }).done(function (data) {
                if (data.msg == 'ok') {
                    showAlert('Pozo Creado Correctamente!', 'success')
                    $("#pozoModal").modal('hide')
                    loadPage('/config')
                }
            }).fail(function () {
                showAlert("Error: No se pudo Crear el Pozo", "danger")
                loadPage('/config')
            })

        }


    })
}

const delUser = (id) => {
    const datos = {
        id: id
    }
    $.ajax({
        type: "POST",
        url: "/deluser",
        data: datos
    }).done(function (data) {
        if (data.msg == 'ok') {
            showAlert('Usuario Eliminado Correctamente!', 'success')
            loadPage('/config')
        }
    }).fail(function () {
        showAlert("Error: No se pudo Eliminar el Usuario", "danger")
        loadPage('/config')
    })
}

const redoPozo = (id, estado) => {
    if(estado == 1) { estado = 2} else { estado = 1 }
    const datos = {
        id: id,
        estado: estado
    }
    $.ajax({
        type: "POST",
        url: "/redopozo",
        data: datos
    }).done(function (data) {
        if (data.msg == 'ok') {
            showAlert('Pozo Actualizado Correctamente!', 'success')
            loadPage('/config')
        }
    }).fail(function () {
        showAlert("Error: No se pudo Actualizar el Estado del Pozo", "danger")
        loadPage('/config')
    })
}

const showAlert = (texto, color) => {
    const alerta = document.createElement("div")
    alerta.id = "alertaModal"
    alerta.setAttribute("class", `alert alert-${color} fixed-top rounded-0`)
    alerta.style.zIndex = "100000000"
    alerta.setAttribute("role", "alert")
    alerta.innerHTML = texto
    document.body.appendChild(alerta)
    $("#alertaModal").alert().slideDown(1000)
    $("#alertaModal").fadeTo(2000, 500).slideUp(1000, function () {
        $("#alertaModal").slideUp(1000)
        $("#alertaModal").remove()
    })
}

const delPozo = (id) => {
    const datos = {
        id: id
    }
    $.ajax({
        type: "POST",
        url: "/delpozo",
        data: datos
    }).done(function (data) {
        if (data.msg == 'ok') {
            showAlert('Pozo Eliminado Correctamente!', 'success')
            loadPage('/config')
        }
    }).fail(function () {
        showAlert("Error: No se pudo Eliminar el Pozo", "danger")
        loadPage('/config')
    })
}

const saveDSN = () => {
    const datos = {
        dsn: $("#dsn").val()
    }
    $.ajax({
        type: "POST",
        url: "/upddsn",
        data: datos
    }).done(function (data) {
        if (data.msg == 'ok') {
            showAlert('DSN Actualizado Correctamente!', 'success')
            loadPage('/config')
        }
    }).fail(function () {
        showAlert("Error: No se pudo Actualizar el DSN", "danger")
        loadPage('/config')
    })
}


const saveQUERY = () => {
    const datos = {
        query: $("#query").val()
    }
    $.ajax({
        type: "POST",
        url: "/updquery",
        data: datos
    }).done(function (data) {
        if (data.msg == 'ok') {
            showAlert('QUERY Actualizado Correctamente!', 'success')
            loadPage('/config')
        }
    }).fail(function () {
        showAlert("Error: No se pudo Actualizar el QUERY", "danger")
        loadPage('/config')
    })
}