import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = () => {
    const location = useLocation();
    const pathNames = location.pathname.split('/').filter(x => x);

    return (
        <div className="breadcrumbs">
            <Link to="/">Home</Link>
            {pathNames.map((name, index) => {
                const routeTo = `/${pathNames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathNames.length - 1;

                return isLast ? (
                    <span key={name}> / {name.replace(/-/g, ' ')}</span>
                ) : (
                    <span key={name}> / <Link to={routeTo}>{name.replace(/-/g, ' ')}</Link></span>
                );
            })}
        </div>
    );
};