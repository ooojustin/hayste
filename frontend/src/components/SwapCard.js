import React from "react";
import classnames from "classnames";

const SwapCard = props => {

    const swap = props.data;
    
    let status = ["Waiting", "bg-yellow-500"];
    if (swap.claimed === true)
        status = ["Claimed", "bg-green-600"];
    else if (swap.claimed === false)
        status = ["Failed", "bg-red-300"];

    return (
        <div className="flex flex-col gap-1 bg-black bg-opacity-20 rounded p-3">
            <div><b>Target: </b>{swap.target}</div>
            <div><b>Threads: </b>{swap.threads}</div>
            <div><b>Account: </b>{swap.account_obj.username}</div>
            <div><b>Checked: </b>{swap.check_count.toLocaleString()}x ({swap.cps} cps)</div>
            <hr className="my-2" />
            <div className={classnames("w-full text-center text-white rounded py-1.5", status[1])}>
                {status[0]}
            </div>
        </div>
    );
}

export default SwapCard;
