import json
from flask import Flask, render_template, request, flash, redirect, url_for
from your_code_here.DataBaseManager import DataBaseManager
from util.Checker import Checker

app = Flask(__name__)
manager = DataBaseManager()
checker = Checker()


@app.route('/')
def index():
    data_list = manager.query_info()
    return render_template('index.html', data_list=data_list)


@app.route('/add', methods=['POST'])
def add_info():
    info = request.json
    if not checker.check_add_fields_exists(info):
        return json.dumps({'success': False, 'reason': '字段不完整'}, ensure_ascii=False)
    fail_reason = checker.check_value_valid(info)
    if fail_reason:
        return json.dumps({'success': False, 'reason': fail_reason}, ensure_ascii=False)
    info['deleted'] = 0
    insert_result = manager.add_info(info)
    return json.dumps({'success': insert_result})


@app.route('/update', methods=['POST'])
def update_info():
    info = request.json
    if not checker.check_update_fields_exists(info):
        return json.dumps({'success': False, 'reason': '字段不完整'}, ensure_ascii=False)
    people_id = checker.transfer_people_id(info['people_id'])
    if people_id == -1:
        return json.dumps({'success': False, 'reason': 'ID必需为数字'})
    dict_tobe_updated = info['updated_info']
    fail_reason = checker.check_value_valid(dict_tobe_updated)
    if fail_reason:
        return json.dumps({'success': False, 'reason': fail_reason}, ensure_ascii=False)
    update_result = manager.update_info(people_id, dict_tobe_updated)
    return json.dumps({'success': update_result})


@app.route('/delete/<people_id>', methods=['GET'])
def delete(people_id):
    people_id = checker.transfer_people_id(people_id)
    if people_id > 0:
        # 弹出确认窗口
        confirmed = checker.confirm_delete()
        if confirmed:
            delete_result = manager.del_info(people_id)
            return json.dumps({'success': delete_result})
        else:
            return json.dumps({'success': False, 'reason': '取消删除'})
    return json.dumps({'success': False, 'reason': 'ID必需为数字'})



@app.route('/search')
def search():
    id = request.args.get('id', '').strip()
    name = request.args.get('name', '').strip()
    age = request.args.get('age', '').strip()
    birthday = request.args.get('birthday', '').strip()
    origin_home = request.args.get('origin_home', '').strip()
    current_home = request.args.get('current_home', '').strip()

    # 检查所有条件是否都为空
    if not any([id, name, age, birthday, origin_home, current_home]):
        return json.dumps({'success': False, 'reason': 'Please enter query criteria!'})
    # 构造查询条件
    conditions = {}
    if id:
        conditions['id'] = int(id)
    if name:
        conditions['name'] = name
    if age:
        conditions['age'] = int(age)
    if birthday:
        conditions['birthday'] = birthday
    if origin_home:
        conditions['origin_home'] = origin_home
    if current_home:
        conditions['current_home'] = current_home
    # 根据条件查询人员信息
    results = manager.search_info(conditions)
    return render_template('search.html', results=results)

