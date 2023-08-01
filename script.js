
const url_posts = 'https://api.slingacademy.com/v1/sample-data/blog-posts';
const url_users = 'https://api.slingacademy.com/v1/sample-data/users';

const div_root = document.querySelector('.root')

fetch(url_users)
    .then((res) => res.json())
    .then((data) => render(data.users));

async function fetchPosts() {
    let res = await fetch(url_posts);
    let data = await res.json();
    return data.blogs;
}


function render(card) {

    card.forEach(elem => {
        let div_card = document.createElement('div');
        div_card.classList.add('card');

        let p_name = document.createElement('p');
        p_name.innerText = `Name: ${elem.first_name}`;

        let p_lastname = document.createElement('p');
        p_lastname.innerText = `Lastname: ${elem.last_name}`;

        let p_email = document.createElement('p');
        p_email.innerText = `Email: ${elem.email}`;

        let p_job = document.createElement('p');
        p_job.innerText = `Job: ${elem.job}`;

        div_card.append(p_name, p_lastname, p_email, p_job);
        div_root.append(div_card);

        div_card.onclick = () => {
            modal(elem)
        }
    });
}

// получение постов и помещение их в массив
async function posts(user) {

    const posts_array = await fetchPosts();
    const h2ElementsArray = [];

    posts_array.forEach(elem => {
        if (elem.user_id === user) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(elem.content_html, 'text/html');
            h2_elements = doc.querySelectorAll('h2');
            h2_elements.forEach((el) => {
                h2ElementsArray.push(el.innerText);
            })
        } 
    })
    return h2ElementsArray;
}


// вызов модального окна с формированием в нем текста
async function modal(user) {

    let div_modal_area = document.createElement('div');
    div_modal_area.classList.add('modal_cover');

    let div_modal_window = document.createElement('div');
    div_modal_window.classList.add('modal');
    
    let h2_modal_name = document.createElement('h2');
    h2_modal_name.classList.add('modal_name');
    h2_modal_name.innerText = `Содержимое постов пользователя \n ${user.first_name} ${user.last_name}:`

    let list_modal_text = document.createElement('ol');
    list_modal_text.classList.add('modal_text');
    let h2_elements = await posts(user.id);

    if (h2_elements.length === 0) {
        list_modal_text.innerText = 'This user has no posts yet';
        list_modal_text.style.cssText = 'color: blue; font-style: italic';
    } else {
        h2_elements.forEach(elem => {
            let li_text = document.createElement('li');
            li_text.innerText = elem;
            list_modal_text.append(li_text);
        })
    }

    div_modal_window.append(h2_modal_name, list_modal_text);
    div_modal_area.append(div_modal_window);

    div_root.append(div_modal_area);


    //закрытие модального окна при клике вне его:
    div_modal_area.onclick = () => {
        div_modal_area.remove();
    }

    // не закрывание окна при клике на самом окне:
    div_modal_window.onclick = (event) => {
        event.stopPropagation();
    }

}