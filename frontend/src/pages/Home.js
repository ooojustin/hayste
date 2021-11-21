import React, { Fragment } from 'react'

const Home = props => {
    return (
        <Fragment>
            <div className="bg-white bg-opacity-11 backdrop-blur-lg rounded-xl border border-h-gray-200 flex flex-col shadow-2xl px-14 py-8">
                <div className="flex flex-row items-center mb-8">
                    <div className="h-14 w-14 bg-h-gray-200 rounded-md mr-4 flex-none"></div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-white text-3xl">hayste.co</span>
                        <span className="font-normal">We step in, where speed matters the most</span>
                    </div>
                </div>
                <div className="text-2xl font-normal mb-3">
                    Check back soon to find out more
                </div>
                <div className="mb-20 font-normal">
                    In the meantime, if you have any questions you can contact us at<br/>
                    <a href="mailto:contact@hayste.co" className="text-white">contact@hayste.co</a>
                </div>
                <div className="text-h-gray-600 font-normal cursor-default self-center">&copy; 2021 HAYSTE</div>
            </div>
        </Fragment>    
    );
}

export default Home;
