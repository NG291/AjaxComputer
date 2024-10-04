$(document).ready(function() {
    loadCategory();
    loadComputer();

    $('#computer-form').on('submit', function(event) {
        event.preventDefault();
        const id = $('#computer-id').val();
        const code = $('#code').val();
        const name = $('#name').val();
        const manufacturer = $('#manufacturer').val();
        const price = $('#price').val();
        const img = $('#img').val();
        const categoryId = $('#category').val();

        if (id) {
            updateComputer(id, code, name, manufacturer, price, img, categoryId);
        } else {
            addComputer(code, name, manufacturer, price, img, categoryId);
        }
    });
});

function loadCategory() {
    $.ajax({
        url: 'http://localhost:8080/api/categories',
        type: 'GET',
        success: function(categories) {
            let categorySelect = $('#category');
            categorySelect.empty();
            categorySelect.append('<option value="">Select a category</option>');

            $.each(categories, function(i, category) {
                categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
            });
        },
        error: function() {
            alert('Unable to load categories');
        }
    });
}

function loadComputer() {
    $.ajax({
        url: 'http://localhost:8080/api/computers',
        type: 'GET',
        success: function(computers) {
            let computerBody = $('#computer-body');
            computerBody.empty();

            $.each(computers, function(i, computer) {
                const categoryName = computer.category ? computer.category.name : 'N/A'
                computerBody.append(`
                    <tr>
                        <td>${computer.id}</td>
                        <td>${computer.code}</td>
                        <td>${computer.name}</td>
                        <td>${computer.manufacturer}</td>
                        <td>${computer.price}</td>                   
                        <td><img src="${computer.img}" alt="${computer.name}" style="width:50px;height:auto;"></td>
                        <td>${categoryName}</td>
                        <td>
                            <button onclick="editComputer(${computer.id})">Edit</button>
                            <button onclick="deleteComputer(${computer.id})">Delete</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function() {
            alert('Unable to load computers');
        }
    });
}


function addComputer(code, name, manufacturer, price, img, categoryId) {
    const computerData = {
        code: code,
        name: name,
        manufacturer: manufacturer,
        price: price,
        img: img,
        category: {
            id: categoryId
        }
    };

    $.ajax({
        url: 'http://localhost:8080/api/computers',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(computerData),
        success: function() {
            alert('Computer added successfully');
            loadComputer();
            clearComputerForm();
        },
        error: function() {
            alert('Error adding computer');
        }
    });
}

function updateComputer(id, code, name, manufacturer, price, img, categoryId) {
    const computerData = {
        id: id,
        code: code,
        name: name,
        manufacturer: manufacturer,
        price: price,
        img: img,
        category: {
            id: categoryId
        }
    };

    $.ajax({
        url: `http://localhost:8080/api/computers/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(computerData),
        success: function() {
            alert('Computer updated successfully');
            loadComputer();
            clearComputerForm();
        },
        error: function() {
            alert('Error updating computer');
        }
    });
}


function deleteComputer(id) {
    $.ajax({
        url: `http://localhost:8080/api/computers/${id}`,
        type: 'DELETE',
        success: function() {
            alert('Computer deleted successfully');
            loadComputer();
        },
        error: function() {
            alert('Error deleting computer');
        }
    });
}

function editComputer(id) {
    $.ajax({
        url: `http://localhost:8080/api/computers/${id}`,
        type: 'GET',
        success: function(computer) {
            $('#computer-id').val(computer.id);
            $('#code').val(computer.code);
            $('#name').val(computer.name);
            $('#manufacturer').val(computer.manufacturer);
            $('#price').val(computer.price);
            $('#img').val(computer.img);
            $('#category').val(computer.category.id);
            $('#computer-submit-button').text('Update Computer');
        },
        error: function() {
            alert('Error loading computer data');
        }
    });
}

function clearComputerForm() {
    $('#computer-id').val('');
    $('#code').val('');
    $('#name').val('');
    $('#manufacturer').val('');
    $('#price').val('');
    $('#img').val('');
    $('#category').val('');
    $('#computer-submit-button').text('Add Computer');
}
