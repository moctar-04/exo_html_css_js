/*exercice 1*/

function changerTexte() {
    let textchange=document.getElementById("titre");
    textchange.innerHTML=" Mouhamed est le chef de groupe ";
    textchange.style.color="blue";
}

/*exercice 2 */

function afficherMessage() {
    alert("vous avez une carte d'invitation");
}

function changerCouleur() {
    let colchange=document.querySelector(".carte")
    colchange.style.color='red';
}

/*Exercice 3 */


function envoyer() {

    let nom = document.getElementById("nom").value;
    let age = document.getElementById("age").value;
    let pays = document.getElementById("pays").value;
    let commentaire = document.getElementById("commentaire").value;

    // Sexe
    let sexe = "";
    let radios = document.getElementsByName("sexe");
    for (let r of radios) {
        if (r.checked) {
            sexe = r.value;
        }
    }

    // Loisirs
    let loisirs = [];
    let checks = document.getElementsByName("loisir");
    for (let c of checks) {
        if (c.checked) {
            loisirs.push(c.value);
        }
    }
    
    // Validation
    if (nom === "" || age === "" || sexe === "" || pays === "" || commentaire === "") {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    // Affichage
    document.getElementById("resultat").innerHTML =
        "Nom : " + nom + "<br>" +
        "Age : " + age + "<br>" +
        "Sexe : " + sexe + "<br>" +
        "Loisirs : " + loisirs.join(", ") + "<br>" +
        "Pays : " + pays + "<br>" +
        "Commentaire : " + commentaire;
}

// function changerPage(page) {
//     document.getElementById("frame").src = page;
// }

/*Exercice 4 */

function addItem() {
  let input = document.getElementById("inputItem");
  let value = input.value.trim();

  if (value === "") return;

  let ul = document.getElementById("list");

  let li = document.createElement("li");
  li.className = "bg-gray-200 px-3 py-2 rounded flex justify-between items-center";

  li.innerHTML = `
    ${value}
    <button onclick="removeItem(this)" class="text-red-500">❌</button>
  `;

  ul.appendChild(li);

  input.value = "";
}

function removeItem(button) {
  button.parentElement.remove();
}