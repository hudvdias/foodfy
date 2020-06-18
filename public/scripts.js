const ShowHide = {
    recipeInfo(event) {
        const {target} = event
        const info = target.parentNode.parentNode.querySelector(".info")
        if (target.innerHTML == "esconder") {
            info.classList.add("hidden")
            target.innerHTML = "mostrar"
        } else {
            info.classList.remove("hidden")
            target.innerHTML = "esconder"
        }
    }
}

const AddItem = {
    input(event) {
        const item = event.target.parentNode
        const div = item.querySelector("div")
        const inputs = item.querySelectorAll("input")
        const newInput = inputs[inputs.length -1].cloneNode(true);
        if (newInput.value == "") return false
        newInput.value = ""
        div.appendChild(newInput)
    }
}

const ValidateForm = {
    recipe(event) {
        const images = document.querySelector(".image-preview").childElementCount
        if (images < 1) {
            const image = document.querySelector("input[type='file']")
            if (image.value == "") {
                image.parentNode.querySelector("p").classList.add("input-error")
                alert("Envie pelo menos uma imagem.")
                event.preventDefault()
                return
            } else {
                image.parentNode.querySelector("p").classList.remove("input-error")
            }
        } else {
            document.querySelectorAll("p").forEach(p => p.classList.remove("input-error"))
        }
        const title = document.querySelector("input[name='title']")
        if (title.value == "") {
            title.classList.add("input-error")
            alert("Insira o título da sua receita.")
            event.preventDefault()
            return
        } else {
            title.classList.remove("input-error")
        }
        const chef = document.querySelector("select[name='chef_id']")
        if (chef.value == "") {
            chef.classList.add("input-error")
            alert("Escolha um chef para a sua receita.")
            event.preventDefault()
            return
        } else {
            chef.classList.remove("input-error")
        }
        const ingredients = document.querySelectorAll("input[name='ingredients[]']")
        let ingredientsArray = Array.from(ingredients).filter(ingredient => ingredient.value == "" ? false : true)
        if (ingredientsArray < 1) {
            ingredients[0].classList.add("input-error")
            alert("Insira pelo menos 1 ingrediente.")
            event.preventDefault()
            return
        } else {
            ingredients[0].classList.remove("input-error")
        }
        const preparation = document.querySelectorAll("input[name='preparation[]']")
        let preparationArray = Array.from(preparation).filter(ingredient => ingredient.value == "" ? false : true)
        if (preparationArray < 1) {
            preparation[0].classList.add("input-error")
            alert("Insira pelo menos 1 passo no modo de preparo.")
            event.preventDefault()
            return
        } else {
            preparation[0].classList.remove("input-error")
        }
    }
}

const ConfirmDelete = {
    recipe(event) {
        confirmation = confirm("Deseja deletar a receita? Essa ação não pode ser desfeita.")
        if (!confirmation) event.preventDefault()
    },
    chef(event) {
        confirmation = confirm("Deseja deletar o chef? Essa ação não pode ser desfeita.")
        if (!confirmation) event.preventDefault()
    },
    user(event) {
        confirmation = confirm("Deseja deletar o usuáio? AVISO: As receitas do usuário também serão apagadas. Essa ação não pode ser desfeita.")
        if (!confirmation) event.preventDefault()
    }
}

//Menu ativo
const currentPage = window.location.pathname
const menuLinks = document.querySelectorAll("header.admin a")
for (link of menuLinks) {
    if(currentPage.includes(link.getAttribute("href"))) link.classList.add("active-menu")
}

const ImageUpload = {
    chef(event) {
        let input = event.target
        let {files} = input
        document.querySelector("input[name=filename]").value = files[0].name
    },
    files: [],
    recipe(event) {
        const imagePreview = document.querySelector(".image-preview")
        let input = event.target
        let {files} = input
        const totalImages = imagePreview.children.length + files.length
        if (files.length > 5 || totalImages > 5) {
            alert("Envie no máximo 5 fotos.")
            event.preventDefault()
            input.files = this.createFileList()
            return
        }
        Array.from(files).forEach(file => {
            this.files.push(file)
            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)
                const div = document.createElement("div")
                const removeButton = document.createElement("i")
                removeButton.classList.add("material-icons")
                removeButton.innerHTML = "close"
                div.onclick = event => {
                    if (imagePreview.children.length == 1) {
                        alert("A receita deve conter pelo menos 1 imagem.")
                        return
                    }
                    const imageDiv = event.target.parentNode
                    const imagesArray = Array.from(imagePreview.children)
                    const index = imagesArray.indexOf(imageDiv)
                    this.files.splice(index, 1)
                    input.files = this.createFileList()
                    imageDiv.remove()

                }
                div.appendChild(image)
                div.appendChild(removeButton)
                imagePreview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })
        return input.files = this.createFileList()
    },
    createFileList() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        this.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },
    removeRecipeImage(event) {
        const images = document.querySelector(".image-preview").children.length
        if (images == 1) {
            alert("A receita deve conter pelo menos 1 imagem.")
            return
        }
        const div = event.target.parentNode
        const removedFiles = document.querySelector("input[name=removed_files]")
        removedFiles.value += `${div.id},`
        div.remove()
    }
}

const ImageGallery = {
    selectImage(event) {
        const image = event.target
        const images = Array.from(image.parentNode.children)
        const mainImage = document.querySelector(".main-image img")
        images.forEach(image => image.classList.remove("selected"))
        image.classList.add("selected")
        mainImage.src = image.src
    }
}

// Mostrar erros nos inputs
const error = document.querySelector(".message.error")
if (error) {
    const message = error.querySelector("p").innerText
    if (message == "Usuário não encontrado.") {
        const input = document.querySelector("input[name='email']")
        input.classList.add("input-error")
    }
    if (message == "Senha incorreta.") {
        const input = document.querySelector("input[name='password']")
        input.classList.add("input-error")
    }
    if (message == "Usuário não cadastrado.") {
        const input = document.querySelector("input[name='email']")
        input.classList.add("input-error")
    }
    if (message == "Os campos de senha devem ser iguais.") {
        const inputs = document.querySelectorAll("input[type='password']")
        inputs.forEach(input => input.classList.add("input-error"))
    }
}