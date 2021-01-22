const Modal = {
  open(){
    // Abrir Modal
    // adicionar a class active do modal
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close(){
    //Fechar Modal
    //remover a class active do modal
    document.querySelector('.modal-overlay').classList.remove('active');
  }
}