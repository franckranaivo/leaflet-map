import './App.css'
import {MapContainer, TileLayer, Marker, Popup, useMap, Polyline} from 'react-leaflet'
import useSwr from "swr";
import {Icon} from "leaflet";


const  fetcher =  (...args) => fetch(...args).then(response => response.json());
const redOptions = { color: 'red' }
const skater = new Icon({
    iconUrl: "src/assets/react.svg",
    iconSize: [50, 50]
});

function App() {
    const position = [48.20865206917485, -1.5069305380233304];
    const position1 = [48.2086520691500, -1.5069305380233200];
    const url =
        "https://opendata.grdf.fr/api/records/1.0/search/?dataset=cartographie-du-reseau-grdf-en-service&q=&rows=500&facet=insee_commune_admin&facet=commune_admin&facet=code_departement_admin&facet=departement_admin&facet=region_admin&refine.commune_admin=Liffr%C3%A9";
    const { data: dataNet, error: errornet } = useSwr(url, { fetcher });

    const urlPBM = "https://opendata.grdf.fr/api/records/1.0/search/?dataset=les-sites-dinjection-de-biomethane-en-france&q=&facet=site&facet=commune&facet=nom_epci&facet=departement&facet=region&facet=date_de_mes&facet=grx_demandeur&facet=type_de_reseau&facet=augmentation_prevue&facet=site_ouvert&refine.commune=Liffr%C3%A9";
    const { data: dataPBM, error: errorPBM } = useSwr(urlPBM, { fetcher });

    if(!dataNet) {
        return <div>Loading ...</div>;
    }

    const  network = dataNet && !errornet ? dataNet['records'] : [];
    const multiPolyline = network.map((record) => record.fields.geo_shape.coordinates)
    const reversed = multiPolyline.map(multiline =>
        multiline.map( coords => coords.reverse())
    );

    const pbmData = dataPBM && !errorPBM ? dataPBM['records'] : [];
    const pbmList = pbmData.map((record) => record.fields);

    const renderPBM = pbmList.map((pbm) => {
            return (<Marker
                key={pbm.id_unique_projet}
                position={pbm.coordonnees}/>
            )
        }
    );
    console.log(renderPBM);


    return (
        <MapContainer
            center={position}
            zoom={14}
            scrollWheelZoom={true}
            style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={redOptions} positions={reversed} />
            <>{renderPBM}</>
            <Marker position={position} icon={skater}/>
            <Marker position={position1} icon={skater}/>
        </MapContainer>
    );
}

export default App
