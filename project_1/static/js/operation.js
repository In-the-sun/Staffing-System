/**
 * Created by kingname on 2018/6/25.
 */
function open_edit_info_modal() {
    $('#modal_edit_info').attr('class', 'modal active');
    var index = $(this).attr('rowindex').toString();
    $('#edit-id').attr('value', $('td[class="id"][rowindex="' + index + '"]').text());
    $('#edit-name').attr('value', $('td[class="name"][rowindex="' + index + '"]').text());
    $('#edit-age').attr('value', $('td[class="age"][rowindex="' + index + '"]').text());
    $('#edit-birthday').attr('value', $('td[class="birthday"][rowindex="' + index + '"]').text());
    $('#edit-origin-home').attr('value', $('td[class="origin-home"][rowindex="' + index + '"]').text());
    $('#edit-current-home').attr('value', $('td[class="current-home"][rowindex="' + index + '"]').text());
}

function close_edit_info_modal() {
    $('#modal_edit_info').attr('class', 'modal')
}

function open_add_info_modal() {
    $('#modal_add_info').attr('class', 'modal active')
}

function close_add_info_modal() {
    $('#modal_add_info').attr('class', 'modal')
}

function delete_people() {
    var url = '/delete/' + $(this).attr('rowIndex');
    console.log(url);
    $.ajax({
        url: url,
        success: function () {
            window.location.reload();
        }
    })
}


function post_info_to_add() {
    var name = $('#input-name').val();
    var age = $('#input-age').val();
    var birthday = $('#input-birthday').val();
    var origin_home = $('#input-origin-home').val();
    var current_home = $('#input-current-home').val();
    if (name.length <= 0) {
        alert('姓名不能为空')
        return
    }
    if (!birthday.match('\\d{4}-\\d{2}-\\d{2}')) {
        alert('生日的格式为：yyyy-mm-dd')
        return
    }
    age = parseInt(age);
    if (isNaN(age) || age < 0 || age > 120) {
        alert('年龄必需为一个范围在0-120之间数字。')
        return
    }
    $.ajax({
        url: '/add',
        data: JSON.stringify({
            'name': name, 'age': age, 'birthday': birthday,
            'origin_home': origin_home, 'current_home': current_home
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            if (data['success']) {
                window.location.reload();
            }
        }
    })
}

function update_info() {
    var id = $('#edit-id').val();
    var name = $('#edit-name').val();
    var age = $('#edit-age').val();
    var birthday = $('#edit-birthday').val();
    var origin_home = $('#edit-origin-home').val();
    var current_home = $('#edit-current-home').val();
    if (name.length <= 0) {
        alert('姓名不能为空')
        return
    }
    if (!birthday.match('\\d{4}-\\d{2}-\\d{2}')) {
        alert('生日的格式为：yyyy-mm-dd')
        return
    }
    age = parseInt(age);
    if (isNaN(age) || age < 0 || age > 120) {
        alert('年龄必需为一个范围在0-120之间数字。')
        return
    }
    $.ajax({
        url: '/update',
        data: JSON.stringify({
            'people_id': id,
            'updated_info': {
                'name': name, 'age': age, 'birthday': birthday,
                'origin_home': origin_home, 'current_home': current_home
            }
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            if (data['success']) {
                window.location.reload();
            } else {
                if ('reason' in data) {
                    alert(data['reason'])
                } else {
                    alert('更新失败')
                }
            }
        }
    })
}

function calc_age() {
    birthYear = parseInt(birthdayStr.split('-')[0]);
    if (birthYear === 2018) {
        return 1
    }
    thisYear = (new Date()).getFullYear();
    return thisYear - birthYear
}

function searchPeople() {
    var searchParams = {};  // 用于存储查询参数的对象

    // 获取各个查询条件的值
    var id = $('#search-id').val().trim();
    var name = $('#search-name').val().trim();
    var age = $('#search-age').val().trim();
    var birthday = $('#search-birthday').val().trim();
    var originHome = $('#search-origin-home').val().trim();
    var currentHome = $('#search-current-home').val().trim();

    searchParams.id = id;
    searchParams.name = name;
    searchParams.age = parseInt(age);
    searchParams.birthday = birthday;
    searchParams.origin_home = originHome;
    searchParams.current_home = currentHome;

    // 执行查询操作，发送查询数据到服务器端
    $.ajax({
        url: '/search',
        data: searchParams,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // 处理查询结果
            // 可以根据返回的 data 对象更新页面内容或执行其他操作
            console.log(data); // 示例：打印查询结果到控制台
        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.log('查询失败:', error);
        }
    });
}


function load() {
    $('button[name="edit_this_info"]').each(function () {
        $(this).click(open_edit_info_modal);
    });
    $('button[name="delete_this_info"]').each(function () {
        $(this).click(delete_people)
    });

    $('#close_edit_modal').click(close_edit_info_modal);
    $('#open_add_modal').click(open_add_info_modal);
    $('#close_add_modal').click(close_add_info_modal);

    $('#add_info').click(post_info_to_add);
    $('#update_info').click(update_info);
    $('#input-birthday').change(function () {
        birthdayStr = $(this).val();
        if (birthdayStr.match('\\d{4}-\\d{2}-\\d{2}')) {
            $('#input-age').val(calc_age())
        }
    });
    $('#edit-birthday').change(function () {
        birthdayStr = $(this).val();
        if (birthdayStr.match('\\d{4}-\\d{2}-\\d{2}')) {
            $('#edit-age').val(calc_age())
        }
    })


    // 添加查询按钮点击事件处理程序
    $('#search-btn').click(searchPeople);


}

load();

