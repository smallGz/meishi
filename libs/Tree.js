class Tree {
    constructor(data){
        this.originData = data;
    }
    getTree(id){
        let _data = this.originData.filter(item =>item.pid == id);
        _data.forEach( d=> {
            d.children = this.getTree(d.id);
        })
        return _data;
    }
  };

  module.exports = Tree;