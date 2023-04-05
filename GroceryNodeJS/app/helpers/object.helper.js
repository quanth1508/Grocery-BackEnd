export default {
    removeFields(object, deleteFields = []) {
        
        if (!object|| typeof(object) !== 'object') return object;

        delete object.updated_at
        delete object.created_at
        delete object.__v
        
        if (Array.isArray(object)) {
            object.forEach(e => {
                this.removeFields(e, deleteFields)
            })
            
            return object
        }

        deleteFields.forEach (element => {
            delete object[element];
        });
    
        Object.keys(object).forEach(element => {
            object[element] = this.removeFields(object[element], deleteFields);
        });

        return object;
    },

    removeIdAndFields(object, deleteFields = []) {
        let fields = deleteFields
        fields.push("_id")
        return this.removeFields(object, fields)
    },

    checkExistField(object, fields) {
        if (!(object instanceof Object)) {
            return false
        }

        let keys = Object.keys(object)
        
        for (let idx in fields) {
            if (!keys.includes(fields[idx])) {
                return false
            }
        }
        return true
    },
}