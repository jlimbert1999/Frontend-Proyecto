import Swal, { SweetAlertIcon } from 'sweetalert2'
export class Mensajes {
  mostrarMensaje(icono: SweetAlertIcon, titulo: string) {
    Swal.fire({
      icon: `${icono}`,
      title: `${titulo}`,
      showConfirmButton: true
    })
  }
  mostrarMensajePregunta(titulo: string, funcionLlamada:()=>void){

    {
      Swal.fire({
        title: `${titulo}`,
        showCancelButton: true,
        confirmButtonText: 'Save',
      }).then((result) => {
        if (result.isConfirmed) {
          funcionLlamada();
        }
      })

    }




  }
}