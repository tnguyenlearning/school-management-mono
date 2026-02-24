import Header from './Header';
import Footer from './Footer';

function DefaultLayout({ children }) {
    return (
        <div className={'wrapper'}>
            <Header />
            <div className={'container'}>
                <div className={'content'}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
