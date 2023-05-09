

//import axios from "axios";
const cadRomaneio = document.querySelector('#submit-cad');

cadRomaneio.addEventListener('click', (ev) => {
  const nome = document.querySelector('#cad-nome').value;
  const cidade = document.querySelector('#cad-cidade').value;
  const endereco = document.querySelector('#cad-end').value;
  const bairro = document.querySelector('#cad-bairro').value;

  console.log(toTitleCase(nome), cidade.toUpperCase(), toTitleCase(endereco), toTitleCase(bairro));

  if (nome.trim() === '') {
    alert('Preencha o campo NOME.');
  } else if (cidade.trim() === '') {
    alert('Preencha o campo CIDADE.');
  } else if (endereco.trim() === '') {
    alert('Preencha o campo ENDEREÇO.');
  } else if (bairro.trim() === '') {
    alert('Preencha o campo BAIRRO.');
  } else {
    const romaneio = {
      nome: toTitleCase(nome),
      cidade: cidade.toUpperCase(),
      endereco: toTitleCase(endereco),
      bairro: toTitleCase(bairro)
    }
    console.log(romaneio);

    axios
      .post("/cadastrar", romaneio)
      .then((res) => {
        console.log(res.status);
        location.reload();
      })
      .catch((e) => {
        console.log(e.response.data.message);
      })
  }
});

listarRomaneios();
function listarRomaneios() {
  axios.get('/listarRomaneios')
    .then((response) => {
      console.log('voltei');
      const roms = response.data.romaneios;
      console.log(roms);

      const romContainer = document.querySelector('#rom-container');
      romContainer.innerHTML = ``;

      roms.forEach(rom => {
        const romElement = document.createElement('div');

        romElement.classList.add('rom-item');

        romElement.innerHTML = `<div class='rom-box box'>
      <h3><input id="${rom._id.toString()}" class='check' type="checkbox" name="item[]" value='{ "id": "${rom._id.toString()}","nome": "${rom.nome.toString()}", "cidade": "${rom.cidade}", "endereco": "${rom.endereco}", "bairro": "${rom.bairro}"}'>
      ${rom.nome}</h3>
      <span class='rom-info'>
        <div class='item-info'>
          <p>${rom.cidade}</p>
          <p>${rom.endereco}</p>
          <p>${rom.bairro}</p>
        </div>
        <div class='item-btns'>
          <button type='button' class='botao btn-edit' value='{"id": "${rom._id.toString()}"}'>editar</button>
          <button type='button' class='botao btn-delete' value='{"id": "${rom._id.toString()}"}'>deletar</button>
        </div>
      </span>
      </div>
      `;
        romContainer.appendChild(romElement);
      })
      const editButtons = document.querySelectorAll(".btn-edit");
      editButtons.forEach(function (btn) {
        console.log('addeventlistener');
        btn.addEventListener('click', (ev) => {
          console.log('edit button clicked')
          //const id = JSON.parse(ev.target.value).id;
          editForm.style.display = "block";
          editSubmit.value = ev.target.value;
          console.log(ev.target.value);
          let rom = document.getElementById(JSON.parse(ev.target.value).id).value;
          rom = JSON.parse(rom);
          console.log(rom);
          editNome.value = rom.nome;
          editCidade.value = rom.cidade;
          editEnd.value = rom.endereco;
          editBairro.value = rom.bairro;
        });
      });

      const deleteButtons = document.querySelectorAll(".btn-delete");
      deleteButtons.forEach(function (btn) {
        btn.addEventListener('click', (ev) => {
          console.log('delete button clicked');
          console.log(JSON.parse(ev.target.value));
          const id = JSON.parse(ev.target.value)
          axios.post('/deletar', id)
            .then((res) => {
              console.log(res.status);
              location.reload();
            })
            .catch((e) => {
              console.log(e.response.data.message);
            })
        })

      });

    })
    .catch(error => {
      console.log(error);
    })
}

function teste() {
  console.log(document.querySelectorAll(".btn-edit"));
}

// Get the button and the modal
const editForm = document.getElementById("editForm");
const editSubmit = document.getElementById("editSubmit");
const editNome = document.getElementById('edit-nome');
const editCidade = document.getElementById('edit-cidade');
const editEnd = document.getElementById('edit-end');
const editBairro = document.getElementById('edit-bairro');

// When the user clicks outside the modal, hide it
window.addEventListener("click", function (event) {
  if (event.target == editForm) {
    editForm.style.display = "none";
  }
});

editSubmit.addEventListener('click', function (ev) {
  ev.preventDefault();
  const novoRomaneio = {
    id: ev.target.value,
    nome: editNome.value,
    cidade: editCidade.value,
    endereco: editEnd.value,
    bairro: editBairro.value
  }
  axios.post('/editar', novoRomaneio)
    .then((res) => {
      console.log(res.status);
      location.reload();
    })
    .catch((e) => {
      console.log(e.response.data.message);
    })
});



function downloadPDF() {
  window.location.href = '/gen-pdf';
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Listen for the submit button click event
document.getElementById('submit-btn').addEventListener('click', function () {
  // Get the checked checkboxes
  const checkedBoxes = document.querySelectorAll('input[name="item[]"]:checked');

  console.log(checkedBoxes[0].value);
  console.log(JSON.parse(checkedBoxes[0].value));

  // Create an array of JSON objects from the checked checkboxes
  const items = [];
  checkedBoxes.forEach(function (checkbox) {
    items.push(checkbox.value);
  });

  const ano = document.querySelector('#lista-ano').value;
  const semana = document.querySelector('#lista-semana').value;

  if (ano.trim() === "") {
    alert('Preencha o campo ANO.');
  } else if (semana.trim() === '') {
    alert('Preencha o campo SEMANA.')
  } else {
    // Send the data to the server-side using an Axios POST request
    axios.post('/download', {
      ano: ano,
      semana: semana,
      items: items
    })
      .then(response => {
        console.log(response);
        window.location.href = '/gen-romaneio';
        /*      //const fileName = 'romaneio sem' + semana + '.pdf'
              //downloadFile(response.data, fileName, 'application/pdf');
                  // Create a Blob object with the response data
              const blob = new Blob([response.data], { type: 'application/pdf' });
              
              // Create a URL for the Blob object
              const url = URL.createObjectURL(blob);
              
              // Create an <a> element with the URL as its href attribute
              const link = document.createElement('a');
              link.href = url;
              link.download = 'example2.pdf'; // Set the filename of the downloaded file
              
              // Trigger a click event on the <a> element to start the download
              link.click();
        */
      })
      .catch(error => {
        console.error(error);
      });
  }



});

function downloadFile(data, filename, type) {
  const file = new Blob([data], { type: type });
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
