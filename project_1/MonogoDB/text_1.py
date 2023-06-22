# coding:utf-8
# 测试连接MongoDB



from pymongo import MongoClient
class Test:
    def __init__(self):
        self.client = MongoClient("192.168.222.151",27017)
        # print(self.client)
    # 192.168.222.188
    def getDBs(self):
        dbs = self.client.list_database_names()
        for db in dbs:
            print(db)

    def query_info(self):
        """
        你需要在这里实现这个方法,
        查询集合people_info并返回所有"deleted"字段为0的数据。
        注意返回的信息需要去掉_id
        """
        return [
            {'id': 1, 'name': '测试数据', 'age': 18, 'birthday': '2000-01-02',
             'origin_home': '测试数据', 'current_home': '测试数据'},
            {'id': 2, 'name': '测试数据', 'age': 18, 'birthday': '2000-01-02',
             'origin_home': '测试数据', 'current_home': '测试数据'},
            {'id': 3, 'name': '测试数据', 'age': 18, 'birthday': '2000-01-02',
             'origin_home': '测试数据', 'current_home': '测试数据'}]
if __name__ == '__main__':

    test = Test()
    test.getDBs()