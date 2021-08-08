export const parseSerializerError = data => {

    if (data.hasOwnProperty("non_field_errors"))
        return data.non_field_errors[0];

    let k = Object.keys(data)[0];
    return `${k}: ${data[k][0]}`;

};

export const clone = obj =>
    JSON.parse(JSON.stringify(obj));
