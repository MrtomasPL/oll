
import User from './user';
import Realmoji from './realmoji';
import Comment from './comment';
import axios from 'axios';


class Instance {
    user: User;

    realmojis: Realmoji[];
    comments: Comment[];
    location: { latitude: number, longitude: number } | undefined;
    creationdate: string;
    caption: string;
    instanceid: string;
    primary: string;
    secondary: string;
    btsMedia: string | undefined;
    music: any;


    constructor(
        user: User, 
        realmojis: Realmoji[], 
        comments: Comment[], 
        location: { latitude: number, longitude: number } | undefined, 
        creationdate: string,
        caption: string, 
        instanceid: string, 
        primary: string, 
        secondary: string, 
        btsMedia: string | undefined,
        music: any
    ) {
        this.user = user;
        this.realmojis = realmojis;
        this.comments = comments;
        this.location = location;
        this.creationdate = creationdate;
        this.caption = caption;
        this.instanceid = instanceid;
        this.primary = primary;
        this.secondary = secondary;
        this.btsMedia = btsMedia;
        this.music = music;
    }

    // static method to create instances (old api)
    static async create(raw: any) {
        let user = User.create(raw.user);

        let caption = raw.caption;
        let instanceid = raw.id;
        let primary = raw.primary.url;
        let secondary = raw.secondary.url; 
		
        let creationdate = Instance.formatTime(raw.takenAt);

        let raw_realmojis = raw.realMojis;
        let realmojis: Realmoji[] = [];
        for (let raw_moji of raw_realmojis) {
            realmojis.push(Realmoji.create(raw_moji));
        }

        let initial_location = undefined;
        if (raw.location) {
            let lat = raw.location._latitude;
            let long = raw.location._longitude;
            initial_location = { latitude: lat, longitude: long };
        }
        let location = initial_location;

        let comments: Comment[] = [];
        for (let raw_comment of raw.comment) {
            comments.push(Comment.create(raw_comment));
        }


        let music: any = raw.music ? raw.music : undefined;

        return new Instance(user, realmojis, comments, location, creationdate, caption, instanceid, primary, secondary, "", music);
    }

    // same but new api
    static async moment(raw: any, rawuser: any) {
        let user = User.create(rawuser);
        let caption = raw.caption;
        let instanceid = raw.id;
        let primary = raw.primary.url;
        let secondary = raw.secondary.url;

        let creationdate = Instance.formatTime(raw.takenAt);

        let raw_realmojis = raw.realMojis;
        let realmojis: Realmoji[] = [];
        for (let raw_moji of raw_realmojis) {
            realmojis.push(Realmoji.moment(raw_moji));
        }

        let initial_location = undefined;
        if (raw.location) {
            let lat = raw.location.latitude;
            let long = raw.location.longitude;
            initial_location = { latitude: lat, longitude: long };
        }
        let location = initial_location;

        let comments: Comment[] = [];
        for (let raw_comment of raw.comments) {
            comments.push(Comment.moment(raw_comment));
        }

        let bts: string | undefined = undefined;
        if (raw.btsMedia) {
            bts = raw.btsMedia.url;
        }

        let music: any = raw.music ? raw.music : undefined;

        return new Instance(user, realmojis, comments, location, creationdate, caption, instanceid, primary, secondary, bts, music);
    }

    // static method to format time
    static formatTime(takenAt: string): string {
        if (!takenAt) return "no date available";

        let postedDate = new Date(takenAt);
        let now = new Date();
        let diffInSeconds = Math.floor((now.getTime() - postedDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            let minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minutes ago`;
        } else {
            return postedDate.toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                month: 'short',
                day: 'numeric'
            });
        }
    }
}

export default Instance;